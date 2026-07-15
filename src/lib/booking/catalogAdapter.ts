/**
 * catalogAdapter — bridges the backend `/services` response shape (channels →
 * sub_categories → services) with the frontend's Service / Ritual model.
 *
 * Why an adapter:
 *   The backend models only the bookable surface (id, name, duration, price,
 *   department_id). The frontend's Service model also carries presentation
 *   data — image, audience, location, requiresConsultation, highlights,
 *   ritualId — that the backend doesn't track in Phase 1. We enrich each
 *   API service with the matching hardcoded entry by NAME so the UI keeps
 *   its imagery without losing the API as source-of-truth for booking IDs.
 *
 * Match strategy:
 *   1. Compare API service.name vs HARDCODED_SERVICES.name (normalised:
 *      lowercased, whitespace-collapsed, trimmed, em-dash variants unified).
 *   2. Strip the variant suffix added by the seed expansion
 *      (e.g. "Deep Tissue Therapy — 60 min" → "Deep Tissue Therapy") so the
 *      hardcoded base service matches all expanded variants.
 *   3. On match, take ALL presentation fields from the hardcoded service and
 *      overlay the API's id / duration_min / price / department_id.
 *   4. On miss, fall back to a synthesised service that uses the API name +
 *      the hardcoded service from the same sub-category's default ritual
 *      mapping (see SUBCAT_TO_RITUAL).
 *
 * Per the user's "Hide them entirely" decision, hardcoded services with no
 * API counterpart are dropped — only services that the backend says exist
 * make it into the final catalog.
 */
import type {
  ApiService,
  ApiSubCategory,
  ServicesResponse,
} from '../api/services';
import { HARDCODED_RITUALS, HARDCODED_SERVICES } from './catalog';
import type { Ritual, RitualId, Service, ServiceVariant } from './types';

// Map a backend sub-category slug to the frontend ritual it belongs in.
// We add an entry here when seeding a new sub-category; the adapter falls
// back to "signature-rituals" for anything unmapped.
const SUBCAT_SLUG_TO_RITUAL: Record<string, RitualId> = {
  'ra-at-home-signature-rituals': 'signature-rituals',
  'ra-at-home-body-massages': 'somatic-recovery',
  'ra-at-home-hand-feet': 'alchemic-aesthetics',
  'ra-at-home-threading': 'velvet-smooth',
};

const FALLBACK_RITUAL: RitualId = 'signature-rituals';

// --- normalisers ---------------------------------------------------------

function normaliseName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[–—]/g, '-') // en-dash, em-dash → "-"
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip a variant duration suffix the seed adds for multi-variant services. */
function stripVariantSuffix(name: string): string {
  // Pattern: "Name — 60 min" or "Name - 60 min" (case-insensitive)
  return name.replace(/\s*[-–—]\s*\d+\s*min\s*$/i, '').trim();
}

// --- catalog builders ----------------------------------------------------

interface EnrichmentResult {
  service: Service;
  ritualId: RitualId;
}

/**
 * Build ONE frontend Service from a group of API rows that share a
 * `variant_group` (the durations of a single logical service). The rows are
 * turned into `variants[]`, and each variant's `id` is the REAL backend
 * service id — that is what the booking payload sends, so picking "90 min"
 * books the 90-min row. Single-row groups still get a one-entry `variants[]`
 * so every cart item carries a bookable backend id in `variantId`.
 *
 * `Service.id` is the stable `variant_group` slug (the card's UI identity),
 * NOT a bookable id — booking always goes through the selected variant.
 */
function enrichServiceGroup(
  groupKey: string,
  rows: ApiService[],
  subCat: ApiSubCategory,
): EnrichmentResult {
  // Order durations by variant_sort (fallback: duration). The first is the
  // default shown on the card and used for quick-add.
  const ordered = [...rows].sort(
    (a, b) =>
      (a.variant_sort ?? a.duration_min) - (b.variant_sort ?? b.duration_min),
  );
  const first = ordered[0];
  const baseName = stripVariantSuffix(first.name);
  const normBase = normaliseName(baseName);

  const variants: ServiceVariant[] = ordered.map((r) => ({
    id: r.id, // real backend service id — the bookable identity
    label: r.variant_label || `${r.duration_min} min`,
    durationMin: r.duration_min,
    price: r.price,
  }));

  const subCatSlug = subCat.meta_information?.slug || subCat.id;
  const defaultRitual: RitualId =
    SUBCAT_SLUG_TO_RITUAL[subCatSlug] ?? FALLBACK_RITUAL;

  // Match the hardcoded presentation entry by base (variant-stripped) name.
  const matched =
    HARDCODED_SERVICES.find((h) => normaliseName(h.name) === normBase) ||
    HARDCODED_SERVICES.find(
      (h) => normaliseName(stripVariantSuffix(h.name)) === normBase,
    );

  if (matched) {
    return {
      service: {
        ...matched,
        id: groupKey, // stable UI identity (variant_group slug)
        name: baseName, // single card title, no duration suffix
        durationMin: first.duration_min,
        price: first.price,
        // Override the hardcoded variants with backend-id-backed ones.
        variants,
        ritualId: matched.ritualId,
      },
      ritualId: matched.ritualId,
    };
  }

  // Unmatched — synthesise a minimal Service so it still renders + books.
  return {
    service: {
      id: groupKey,
      name: baseName,
      ritualId: defaultRitual,
      description: first.description || '',
      durationMin: first.duration_min,
      price: first.price,
      image: '',
      audience: 'unisex',
      location: 'home',
      variants,
    },
    ritualId: defaultRitual,
  };
}

export interface AdaptedCatalog {
  services: Service[];
  rituals: Ritual[];
  /** Index: ritualId → which channel(s) host services in that ritual. */
  ritualToChannel: Record<string, string[]>;
}

/**
 * Build the frontend catalog from the API response. Only sub-categories
 * with status="active" (or unset) contribute services; coming-soon /
 * not-launched / invite-only cells are ignored at the service level (the
 * UI still uses the API tree separately to render those placeholders).
 */
export function adaptCatalog(response: ServicesResponse): AdaptedCatalog {
  const services: Service[] = [];
  const ritualIdsSeen = new Set<RitualId>();
  const ritualToChannel: Record<string, string[]> = {};

  for (const channel of response.channels) {
    const channelStatus = channel.meta_information?.status ?? 'active';
    if (channelStatus !== 'active') continue; // skip not-launched / invite-only

    for (const sub of channel.sub_categories) {
      const subStatus = sub.meta_information?.status ?? 'active';
      if (subStatus !== 'active') continue;

      // Group this sub-category's rows by variant_group (durations of the same
      // logical service) so they collapse into a single card. Rows with no
      // group fall back to their own id → a standalone single-variant card.
      // Insertion order is preserved so grouping doesn't reshuffle the menu.
      const groups = new Map<string, ApiService[]>();
      for (const apiSvc of sub.services) {
        const key = apiSvc.variant_group || apiSvc.id;
        const arr = groups.get(key);
        if (arr) arr.push(apiSvc);
        else groups.set(key, [apiSvc]);
      }

      for (const [groupKey, rows] of groups) {
        const { service, ritualId } = enrichServiceGroup(groupKey, rows, sub);
        services.push(service);
        ritualIdsSeen.add(ritualId);
        (ritualToChannel[ritualId] = ritualToChannel[ritualId] || []).push(
          channel.id,
        );
      }
    }
  }

  // Only expose rituals that have at least one API-backed service. This honours
  // the "Hide entirely" decision — empty rituals don't appear in the UI.
  const rituals = HARDCODED_RITUALS.filter((r) => ritualIdsSeen.has(r.id));

  return { services, rituals, ritualToChannel };
}

// Empty default for the loading state — keeps consumers' type narrowing simple.
export const EMPTY_CATALOG: AdaptedCatalog = {
  services: [],
  rituals: [],
  ritualToChannel: {},
};

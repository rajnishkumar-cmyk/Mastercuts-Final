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
  ApiChannel,
  ApiService,
  ApiSubCategory,
  ServicesResponse,
} from '../api/services';
import { HARDCODED_RITUALS, HARDCODED_SERVICES } from './catalog';
import type { Ritual, RitualId, Service } from './types';

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
 * Build a frontend Service from an API service row, enriching with the
 * matching hardcoded entry where present.
 */
function enrichService(
  apiSvc: ApiService,
  subCat: ApiSubCategory,
): EnrichmentResult {
  const apiName = apiSvc.name;
  const baseName = stripVariantSuffix(apiName);
  const normBase = normaliseName(baseName);
  const normFull = normaliseName(apiName);

  const subCatSlug = subCat.meta_information?.slug || subCat.id;
  const defaultRitual: RitualId =
    SUBCAT_SLUG_TO_RITUAL[subCatSlug] ?? FALLBACK_RITUAL;

  // Try exact-name match first; then base-name match (variant-stripped).
  const matched =
    HARDCODED_SERVICES.find((h) => normaliseName(h.name) === normFull) ||
    HARDCODED_SERVICES.find((h) => normaliseName(h.name) === normBase);

  if (matched) {
    return {
      service: {
        ...matched,
        // Backend is the source of truth for bookable identity + price/duration.
        id: apiSvc.id,
        name: apiSvc.name, // includes variant suffix when applicable
        durationMin: apiSvc.duration_min,
        price: apiSvc.price,
        // Preserve hardcoded ritual mapping unless the sub-category overrides.
        ritualId: matched.ritualId,
      },
      ritualId: matched.ritualId,
    };
  }

  // Unmatched API service — synthesise a minimal Service so it still books.
  // Image and detail copy will be empty until someone adds the hardcoded entry.
  return {
    service: {
      id: apiSvc.id,
      name: apiSvc.name,
      ritualId: defaultRitual,
      description: apiSvc.description || '',
      durationMin: apiSvc.duration_min,
      price: apiSvc.price,
      image: '',
      audience: 'unisex',
      location: 'home',
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

      for (const apiSvc of sub.services) {
        const { service, ritualId } = enrichService(apiSvc, sub);
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

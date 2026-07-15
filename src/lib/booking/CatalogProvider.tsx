/**
 * CatalogProvider — fetches /services on mount, normalises via catalogAdapter,
 * exposes the data + helper functions through useCatalog().
 *
 * Design notes:
 *   - The shape returned by useCatalog() mirrors what catalog.ts exported
 *     before the migration: `services`, `rituals`, `getService(id)`,
 *     `getRitual(id)`, etc. Consumer call sites stay almost identical —
 *     they just destructure from the hook instead of importing directly.
 *   - Therapists, packages, and journey totals remain hardcoded (no
 *     backend tables for those in Phase 1). They're surfaced unchanged
 *     through the hook so consumers don't need two imports.
 *   - The provider also exposes the raw `channelTree` from the API so the
 *     landing page can render coming-soon / not-launched channels straight
 *     from backend metadata without going through the adapter.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { fetchServices, type ServicesResponse } from '../api/services';
import { ApiError, NetworkError } from '../api/errors';
import {
  HARDCODED_PACKAGES,
  HARDCODED_THERAPISTS,
  getFrequentlyAddedSuggestions as legacyFrequentlyAdded,
  getJourneyTotals as legacyJourneyTotals,
  type JourneyTotals,
} from './catalog';
import { adaptCatalog, EMPTY_CATALOG, type AdaptedCatalog } from './catalogAdapter';
import type {
  Package,
  Ritual,
  Service,
  ServiceAudience,
  Therapist,
} from './types';

export type CatalogStatus = 'loading' | 'ready' | 'error';

export interface CatalogContextValue {
  status: CatalogStatus;
  error: string | null;

  // Bookable surface — driven by the API.
  services: Service[];
  rituals: Ritual[];

  // Hardcoded surface — unchanged from Phase 1 catalog.
  therapists: Therapist[];
  packages: Package[];
  journeys: Package[];

  // Helpers (same signatures as the old catalog.ts exports).
  getService: (id: string) => Service | undefined;
  getRitual: (id: string) => Ritual | undefined;
  getTherapist: (id: string) => Therapist | undefined;
  getTherapistsForRitual: (ritualId: string) => Therapist[];
  getServicesForRitual: (ritualId: string, audience?: ServiceAudience) => Service[];
  getAtHomeServices: (audience?: ServiceAudience) => Service[];
  getAddOnsForService: (service: Service) => Service[];
  getPackagesForRitual: (ritualId: string) => Package[];
  getJourney: (id: string) => Package | undefined;
  getFrequentlyAddedSuggestions: (cartServiceIds: string[], limit?: number) => Service[];
  getJourneyTotals: (journey: Package) => JourneyTotals;

  // Raw API tree — for landing page channel placeholders (coming-soon etc.).
  channelTree: ServicesResponse['channels'];

  refetch: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

interface ProviderState {
  status: CatalogStatus;
  error: string | null;
  catalog: AdaptedCatalog;
  channelTree: ServicesResponse['channels'];
}

const INITIAL_STATE: ProviderState = {
  status: 'loading',
  error: null,
  catalog: EMPTY_CATALOG,
  channelTree: [],
};

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProviderState>(INITIAL_STATE);
  // Abort the in-flight request when refetch is called or the provider unmounts.
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    fetchServices(controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'ready',
          error: null,
          catalog: adaptCatalog(response),
          channelTree: response.channels,
        });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof ApiError
            ? `Catalog API ${err.statusCode}: ${err.message}`
            : err instanceof NetworkError
              ? err.message
              : 'Failed to load services catalog';
        setState({
          status: 'error',
          error: message,
          catalog: EMPTY_CATALOG,
          channelTree: [],
        });
      });
  }, []);

  useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const value = useMemo<CatalogContextValue>(() => {
    const { catalog, channelTree, status, error } = state;
    const { services, rituals } = catalog;

    const getService = (id: string) => services.find((s) => s.id === id);
    const getRitual = (id: string) => rituals.find((r) => r.id === id);
    const getTherapist = (id: string) =>
      HARDCODED_THERAPISTS.find((t) => t.id === id);
    const getTherapistsForRitual = (ritualId: string) =>
      HARDCODED_THERAPISTS.filter((t) => t.ritualIds.includes(ritualId as never));

    const getServicesForRitual = (
      ritualId: string,
      audience?: ServiceAudience,
    ): Service[] =>
      services.filter((s) => {
        if (s.isAddon) return false; // add-ons never appear as standalone cards
        if (s.ritualId !== ritualId) return false;
        if (!audience || audience === 'unisex') return true;
        return s.audience === audience || s.audience === 'unisex';
      });

    const getAtHomeServices = (audience?: ServiceAudience): Service[] =>
      services.filter((s) => {
        if (s.isAddon) return false; // add-ons never appear as standalone cards
        const loc = s.location ?? 'salon';
        if (loc === 'salon') return false;
        if (!audience || audience === 'unisex') return true;
        return s.audience === audience || s.audience === 'unisex';
      });

    // Resolve the add-on Services a given service offers, from its addonGroups
    // slugs. Add-ons live in the full `services` list (only the grid getters
    // filter them out), so they resolve by id (= their variant_group slug).
    const getAddOnsForService = (service: Service): Service[] =>
      (service.addonGroups ?? [])
        .map((slug) => services.find((s) => s.id === slug))
        .filter((s): s is Service => !!s);

    const getPackagesForRitual = (ritualId: string): Package[] => {
      const idsForRitual = new Set(
        services.filter((s) => s.ritualId === ritualId).map((s) => s.id),
      );
      return HARDCODED_PACKAGES.filter((p) =>
        p.serviceIds.some((id) => idsForRitual.has(id)),
      );
    };

    const getJourney = (id: string) => HARDCODED_PACKAGES.find((p) => p.id === id);

    const getFrequentlyAddedSuggestions = (
      cartServiceIds: string[],
      limit = 6,
    ): Service[] => {
      // Delegate to the existing pure helper, but pass our `services` list
      // by temporarily aliasing — legacy helper reads from the hardcoded
      // module-level `services` const, so we re-implement it here against
      // the API-derived list.
      if (cartServiceIds.length === 0) return [];
      const cartRitualIds = new Set<string>();
      const cartIdSet = new Set(cartServiceIds);
      for (const id of cartServiceIds) {
        const svc = getService(id);
        if (svc) cartRitualIds.add(svc.ritualId);
      }
      const sameRitual: Service[] = [];
      const crossRitual: Service[] = [];
      for (const svc of services) {
        if (cartIdSet.has(svc.id)) continue;
        if (cartRitualIds.has(svc.ritualId)) sameRitual.push(svc);
        else crossRitual.push(svc);
      }
      const result: Service[] = [];
      for (const svc of sameRitual) {
        if (result.length >= limit) break;
        result.push(svc);
      }
      for (const svc of crossRitual) {
        if (result.length >= limit) break;
        result.push(svc);
      }
      return result;
    };

    const getJourneyTotals = (journey: Package): JourneyTotals => {
      const resolved = journey.serviceIds
        .map((id) => getService(id))
        .filter(Boolean) as Service[];
      const totalDuration = resolved.reduce((s, svc) => s + svc.durationMin, 0);
      const totalPriceFull = resolved.reduce((s, svc) => s + svc.price, 0);
      const totalPriceDiscounted = Math.round(
        totalPriceFull * (1 - journey.savings / 100),
      );
      return {
        totalDuration,
        totalPriceFull,
        totalPriceDiscounted,
        savingsAed: totalPriceFull - totalPriceDiscounted,
      };
    };
    // legacy helpers kept available for non-React contexts (none today, but the
    // import keeps them tree-shakeable).
    void legacyFrequentlyAdded;
    void legacyJourneyTotals;

    return {
      status,
      error,
      services,
      rituals,
      therapists: HARDCODED_THERAPISTS,
      packages: HARDCODED_PACKAGES,
      journeys: HARDCODED_PACKAGES,
      getService,
      getRitual,
      getTherapist,
      getTherapistsForRitual,
      getServicesForRitual,
      getAtHomeServices,
      getAddOnsForService,
      getPackagesForRitual,
      getJourney,
      getFrequentlyAddedSuggestions,
      getJourneyTotals,
      channelTree,
      refetch: load,
    };
  }, [state, load]);

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error(
      'useCatalog must be used inside <CatalogProvider>. Wrap your app root.',
    );
  }
  return ctx;
}

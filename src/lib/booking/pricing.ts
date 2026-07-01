// VAT is applied per service. Catalog prices are VAT-INCLUSIVE (UAE 5%), so
// each line's net is `price / 1.05` and its VAT is the remainder. Summing the
// per-line values gives the cart/booking breakdown — the customer's total
// (sum of inclusive prices) is unchanged.
export const VAT_RATE = 0.05;

export interface VatBreakdown {
  subtotal: number;
  vat: number;
  total: number;
}

export function computeVatBreakdown(prices: number[]): VatBreakdown {
  const subtotal = prices.reduce((s, p) => s + p / (1 + VAT_RATE), 0);
  const total = prices.reduce((s, p) => s + p, 0);
  return { subtotal, vat: total - subtotal, total };
}

// VAT portion contained within a single VAT-inclusive service price.
export function serviceVat(price: number): number {
  return price - price / (1 + VAT_RATE);
}

import Decimal from 'decimal.js';

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

/** Round half-up to 2 decimal places and return a fixed string. Never use binary floats for money. */
export function money(value: Decimal.Value): string {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

export function decimal(value: Decimal.Value): Decimal {
  return new Decimal(value);
}

export { Decimal };

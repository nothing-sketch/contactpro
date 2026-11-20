import { decimal, money } from './money';

export type RuleKind = 'PERCENT' | 'FIXED';
export type RuleBasis = 'CONTRACT' | 'CHEQUE';

export interface RuleItemInput {
  id?: string;
  name: string;
  kind: RuleKind;
  value: string;
  basis: RuleBasis;
  reducesCheque: boolean;
  sort: number;
}

export interface CalculationLine {
  ruleItemId?: string;
  name: string;
  kind: RuleKind;
  basis: RuleBasis;
  rate: string;
  amount: string;
  reducesCheque: boolean;
}

export interface CalculationResult {
  contractValue: string;
  chequeAmount: string;
  sharePct: string;
  subcontractAmount: string;
  deductionsTotal: string;
  expectedProfit: string;
  lines: CalculationLine[];
}

/**
 * Pure rule engine.
 * Cheque = contract value minus items flagged reducesCheque (contract basis or fixed only).
 * Percent items use either the contract value or that cheque.
 * Subcontract share is per contract, not a template percentage.
 * Money is rounded half-up to 2 decimals (so 3.5% of 280,500 stays 9,817.50).
 */
export function calculateContract(input: {
  contractValue: string;
  sharePct: string;
  items: RuleItemInput[];
}): CalculationResult {
  const contractValue = decimal(input.contractValue);
  const sharePct = decimal(input.sharePct);
  if (contractValue.lte(0)) {
    throw new Error('Contract value must be greater than zero.');
  }
  if (sharePct.lt(0) || sharePct.gt(100)) {
    throw new Error('Subcontract share must be between 0 and 100.');
  }

  const items = [...input.items].sort((a, b) => a.sort - b.sort);
  let chequeReduction = decimal(0);
  for (const item of items) {
    if (!item.reducesCheque) continue;
    if (item.basis === 'CHEQUE') {
      throw new Error(`"${item.name}" uses the cheque amount and cannot also reduce it.`);
    }
    chequeReduction = chequeReduction.plus(rawAmount(item, contractValue, decimal(0)));
  }

  const cheque = contractValue.minus(chequeReduction);
  if (cheque.lt(0)) {
    throw new Error('Cheque amount cannot be negative. Check the pre-cheque deductions.');
  }

  const lines: CalculationLine[] = items.map((item) => ({
    ruleItemId: item.id,
    name: item.name,
    kind: item.kind,
    basis: item.basis,
    rate: decimal(item.value).toString(),
    amount: money(rawAmount(item, contractValue, cheque)),
    reducesCheque: item.reducesCheque,
  }));

  const subcontract = contractValue.mul(sharePct).div(100);
  const deductions = lines.reduce((sum, line) => sum.plus(line.amount), decimal(0));
  const profit = contractValue.minus(deductions).minus(subcontract);

  return {
    contractValue: money(contractValue),
    chequeAmount: money(cheque),
    sharePct: sharePct.toString(),
    subcontractAmount: money(subcontract),
    deductionsTotal: money(deductions),
    expectedProfit: money(profit),
    lines,
  };
}

function rawAmount(item: RuleItemInput, contractValue: ReturnType<typeof decimal>, cheque: ReturnType<typeof decimal>) {
  if (item.kind === 'FIXED') return decimal(item.value);
  const base = item.basis === 'CHEQUE' ? cheque : contractValue;
  return base.mul(item.value).div(100);
}

/** Office deductions for the documented GE Navy piece example. Not hardcoded inside the calculator. */
export const GOLDEN_GE_NAVY_ITEMS: RuleItemInput[] = [
  { name: 'EAG office', kind: 'PERCENT', value: '15', basis: 'CONTRACT', reducesCheque: true, sort: 1 },
  { name: 'Advance', kind: 'PERCENT', value: '3.5', basis: 'CHEQUE', reducesCheque: false, sort: 2 },
  { name: 'Ex-money', kind: 'PERCENT', value: '2', basis: 'CONTRACT', reducesCheque: false, sort: 3 },
  { name: 'CMES', kind: 'PERCENT', value: '0.70', basis: 'CONTRACT', reducesCheque: false, sort: 4 },
  { name: 'Contract money', kind: 'FIXED', value: '7200', basis: 'CONTRACT', reducesCheque: false, sort: 5 },
  { name: 'N.Ju stamp', kind: 'FIXED', value: '1440', basis: 'CONTRACT', reducesCheque: false, sort: 6 },
  { name: 'Dapci', kind: 'FIXED', value: '2000', basis: 'CONTRACT', reducesCheque: false, sort: 7 },
  { name: 'SDO office', kind: 'FIXED', value: '6000', basis: 'CONTRACT', reducesCheque: false, sort: 8 },
];

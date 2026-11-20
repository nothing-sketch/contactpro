export { money, decimal, Decimal } from './money';
export {
  calculateContract,
  GOLDEN_GE_NAVY_ITEMS,
  type RuleItemInput,
  type RuleKind,
  type RuleBasis,
  type CalculationLine,
  type CalculationResult,
} from './rule-engine';

export const ROLES = ['ADMIN', 'ACCOUNTS', 'VIEWER'] as const;
export type Role = (typeof ROLES)[number];

export const CONTRACT_STATUSES = [
  'DRAFT',
  'TRIAL',
  'RUNNING',
  'WORK_COMPLETE',
  'BILLED',
  'CHEQUE_RECEIVED',
  'SUB_PAID',
  'CLOSED',
  'CANCELLED',
] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const STATUS_LABEL: Record<ContractStatus, string> = {
  DRAFT: 'Draft',
  TRIAL: 'Trial',
  RUNNING: 'Running',
  WORK_COMPLETE: 'Work Complete',
  BILLED: 'Billed',
  CHEQUE_RECEIVED: 'Cheque Received',
  SUB_PAID: 'Sub Paid',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

/** Allowed manual moves. Closing is checked separately against unconfirmed payments. */
export const NEXT_STATUSES: Record<ContractStatus, ContractStatus[]> = {
  DRAFT: ['TRIAL', 'RUNNING', 'CANCELLED'],
  TRIAL: ['RUNNING', 'CANCELLED'],
  RUNNING: ['WORK_COMPLETE', 'CANCELLED'],
  WORK_COMPLETE: ['BILLED', 'CANCELLED'],
  BILLED: ['CHEQUE_RECEIVED', 'CANCELLED'],
  CHEQUE_RECEIVED: ['SUB_PAID', 'CANCELLED'],
  SUB_PAID: ['CLOSED', 'CANCELLED'],
  CLOSED: [],
  CANCELLED: [],
};

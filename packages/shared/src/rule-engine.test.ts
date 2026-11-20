import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateContract, GOLDEN_GE_NAVY_ITEMS } from './rule-engine';

describe('rule engine', () => {
  it('matches the golden contract: 330,000 at 53% → profit 70,232.50', () => {
    const result = calculateContract({
      contractValue: '330000',
      sharePct: '53',
      items: GOLDEN_GE_NAVY_ITEMS,
    });

    assert.equal(result.chequeAmount, '280500.00');
    assert.equal(result.lines.find((line) => line.name === 'EAG office')?.amount, '49500.00');
    assert.equal(result.lines.find((line) => line.name === 'Advance')?.amount, '9817.50');
    assert.equal(result.lines.find((line) => line.name === 'Ex-money')?.amount, '6600.00');
    assert.equal(result.lines.find((line) => line.name === 'CMES')?.amount, '2310.00');
    assert.equal(result.subcontractAmount, '174900.00');
    assert.equal(result.expectedProfit, '70232.50');
  });

  it('keeps a frozen item list unchanged when the caller passes a copy', () => {
    const first = calculateContract({
      contractValue: '330000',
      sharePct: '53',
      items: GOLDEN_GE_NAVY_ITEMS,
    });
    const changed = GOLDEN_GE_NAVY_ITEMS.map((item) =>
      item.name === 'EAG office' ? { ...item, value: '10' } : item,
    );
    const second = calculateContract({
      contractValue: '330000',
      sharePct: '53',
      items: changed,
    });
    assert.equal(first.expectedProfit, '70232.50');
    assert.notEqual(second.expectedProfit, first.expectedProfit);
    assert.equal(second.chequeAmount, '297000.00');
  });

  it('rejects a cheque-basis item that also reduces the cheque', () => {
    assert.throws(
      () =>
        calculateContract({
          contractValue: '100000',
          sharePct: '50',
          items: [
            { name: 'Bad', kind: 'PERCENT', value: '3.5', basis: 'CHEQUE', reducesCheque: true, sort: 1 },
          ],
        }),
      /cannot also reduce it/,
    );
  });
});

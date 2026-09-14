import { describe, expect, it } from 'vitest'
import { average, extremeItem, maxValue, median, minValue, percentile } from '../statistics'

describe('statistics', () => {
  it('average retorna null para lista vazia e a média para o resto', () => {
    expect(average([])).toBeNull()
    expect(average([2, 4, 6])).toBe(4)
  })

  it('median lida com quantidade par e ímpar de valores', () => {
    expect(median([])).toBeNull()
    expect(median([1, 2, 3])).toBe(2)
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('minValue e maxValue retornam null para lista vazia', () => {
    expect(minValue([])).toBeNull()
    expect(maxValue([])).toBeNull()
    expect(minValue([5, 1, 3])).toBe(1)
    expect(maxValue([5, 1, 3])).toBe(5)
  })

  it('percentile retorna null para lista vazia e interpola entre posições', () => {
    expect(percentile([], 0.5)).toBeNull()
    expect(percentile([1, 2, 3, 4, 5], 0.5)).toBe(3)
    expect(percentile([1, 2, 3, 4], 0.5)).toBe(2.5)
    expect(percentile([1, 2, 3, 4, 5], 0)).toBe(1)
    expect(percentile([1, 2, 3, 4, 5], 1)).toBe(5)
  })

  it('percentile não é afetado pela ordem de entrada', () => {
    expect(percentile([5, 1, 3, 2, 4], 0.5)).toBe(3)
  })

  it('extremeItem encontra o item de maior/menor valor segundo o seletor', () => {
    const items = [{ v: 5 }, { v: 1 }, { v: 9 }]
    expect(extremeItem(items, (i) => i.v, 'max')).toEqual({ v: 9 })
    expect(extremeItem(items, (i) => i.v, 'min')).toEqual({ v: 1 })
    expect(extremeItem([], (i: { v: number }) => i.v, 'max')).toBeNull()
  })
})

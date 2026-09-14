/**
 * GAP de desconto: espaço entre o desconto Limite (máximo permitido) e o
 * desconto Fidelidade (praticado). Só faz sentido quando os dois valores
 * existem — o chamador é responsável por não invocar com `null`.
 */
export function calculateGap(fidelityPercentage: number, limitPercentage: number): number {
  return limitPercentage - fidelityPercentage
}

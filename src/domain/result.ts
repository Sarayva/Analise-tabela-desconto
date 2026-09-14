/**
 * Resultado explícito de sucesso/erro, usado em vez de exceções para falhas
 * esperadas (ex.: estrutura de arquivo inválida) — o chamador é obrigado a
 * tratar os dois casos.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

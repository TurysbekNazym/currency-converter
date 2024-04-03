export interface ICurrency {
  code: string,
  value: number
}
export interface ICurrencyResponse {
  data: {[key: string]: ICurrency},
  meta: Date
}

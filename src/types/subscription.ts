
export interface SubscriptionData {
  id: string
  dataAssinatura: string
  valor: number
  ciclo: string
  status: string
  proimoPagamento: string
  creditCard: {
    creditCardNumber: string
    creditCardBrand: string
    creditCardToken: string
  }
}

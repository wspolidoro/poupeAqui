
import { supabase } from '@/integrations/supabase/client'
import type { SubscriptionData } from '@/types/subscription'

export const fetchUserSubscriptionId = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('assinaturaid')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data?.assinaturaid || null
}

export const fetchSubscriptionInfo = async (subscriptionId: string): Promise<SubscriptionData> => {
  const apiUrlProd = "https://n8.z4u.com.br/webhook/assinatura/info";
  const apiUrlSandbox = "https://n8.z4u.com.br/webhook-test/assinatura/info";

  const response = await fetch(apiUrlProd, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('USUARIO:SENHA')
    },
    body: new URLSearchParams({
      subscription: subscriptionId
    })
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar informações da assinatura')
  }

  return await response.json()
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const getCycleLabel = (cycle: string): string => {
  switch (cycle) {
    case 'MONTHLY':
      return 'Mensal'
    case 'YEARLY':
      return 'Anual'
    case 'QUARTERLY':
      return 'Trimestral'
    default:
      return cycle
  }
}

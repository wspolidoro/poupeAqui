
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { CreditCard, RefreshCw } from 'lucide-react'
import { fetchUserSubscriptionId, fetchSubscriptionInfo } from '@/utils/subscription'
import { SubscriptionDetails } from './SubscriptionDetails'
import { PaymentMethod } from './PaymentMethod'
import type { SubscriptionData } from '@/types/subscription'

export function SubscriptionInfo() {
  const { user } = useAuth()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [assinaturaId, setAssinaturaId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (assinaturaId) {
      loadSubscriptionInfo()
    }
  }, [assinaturaId])

  const loadUserProfile = async () => {
    try {
      const subscriptionId = await fetchUserSubscriptionId(user?.id!)
      if (subscriptionId) {
        setAssinaturaId(subscriptionId)
      } else {
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error)
      setLoading(false)
    }
  }

  const loadSubscriptionInfo = async () => {
    try {
      const data = await fetchSubscriptionInfo(assinaturaId!)
      setSubscriptionData(data)
    } catch (error: any) {
      console.error('Erro ao buscar assinatura:', error)
      toast({
        title: "Erro ao carregar assinatura",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informações da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!assinaturaId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informações da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Você não possui uma assinatura ativa</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscriptionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informações da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">Erro ao carregar informações da assinatura</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Informações da Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SubscriptionDetails subscriptionData={subscriptionData} />
        <Separator />
        <PaymentMethod creditCard={subscriptionData.creditCard} />
        <div className="text-xs text-muted-foreground">
          ID da Assinatura: {subscriptionData.id}
        </div>
      </CardContent>
    </Card>
  )
}

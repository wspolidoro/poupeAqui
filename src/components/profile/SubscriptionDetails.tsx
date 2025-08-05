
import { Calendar, DollarSign, Clock, RefreshCw } from 'lucide-react'
import { formatDate, formatCurrency, getCycleLabel } from '@/utils/subscription'
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge'
import type { SubscriptionData } from '@/types/subscription'

interface SubscriptionDetailsProps {
  subscriptionData: SubscriptionData
}

export function SubscriptionDetails({ subscriptionData }: SubscriptionDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Data da Assinatura</p>
            <p className="font-medium">{formatDate(subscriptionData.dataAssinatura)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Valor</p>
            <p className="font-medium text-lg">{formatCurrency(subscriptionData.valor)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Próximo Pagamento</p>
            <p className="font-medium">{formatDate(subscriptionData.proimoPagamento)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Ciclo</p>
            <p className="font-medium">{getCycleLabel(subscriptionData.ciclo)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-5 w-5 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-current"></div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="mt-1">
              <SubscriptionStatusBadge status={subscriptionData.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

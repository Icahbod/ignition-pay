'use client'

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface TransactionRowProps {
  id: string
  type: 'sent' | 'received'
  asset: string
  amount: number
  recipient: string
  timestamp: Date
  status: 'confirmed' | 'pending'
}

export function TransactionRow({
  type,
  asset,
  amount,
  recipient,
  timestamp,
  status,
}: TransactionRowProps) {
  const displayRecipient = recipient.slice(0, 6) + '...' + recipient.slice(-4)
  const isSent = type === 'sent'

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSent ? 'bg-red-500/20' : 'bg-green-500/20'
          }`}
        >
          {isSent ? (
            <ArrowUpRight size={20} className="text-red-500" />
          ) : (
            <ArrowDownLeft size={20} className="text-green-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">
            {isSent ? 'Sent' : 'Received'} {asset}
          </p>
          <p className="text-sm text-muted-foreground truncate">{displayRecipient}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className={`font-semibold ${isSent ? 'text-red-500' : 'text-green-500'}`}>
          {isSent ? '-' : '+'}
          {amount.toFixed(4)} {asset}
        </p>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
        {status === 'pending' && (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500">
            Pending
          </span>
        )}
      </div>
    </div>
  )
}

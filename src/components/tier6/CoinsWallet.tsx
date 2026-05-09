"use client"

import * as React from "react"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui"

export const CoinsWallet = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Coins Wallet</h3>
      <p className="text-muted-foreground mb-4">
        Usage-based billing and coin management
      </p>
      <Badge variant="secondary">Tier 6</Badge>
    </Card>
  )
}

export default CoinsWallet

"use client"

import * as React from "react"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui"

export const OpportunityRadar = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Opportunity Radar</h3>
      <p className="text-muted-foreground mb-4">
        AI-powered opportunity detection and analysis
      </p>
      <Badge variant="secondary">Core Feature</Badge>
    </Card>
  )
}

export default OpportunityRadar

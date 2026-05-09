"use client"

import * as React from "react"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui"

export const GamificationDashboard = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Gamification Dashboard</h3>
      <p className="text-muted-foreground mb-4">
        Points, badges, levels, and achievement system
      </p>
      <Badge variant="secondary">Tier 5</Badge>
    </Card>
  )
}

export default GamificationDashboard

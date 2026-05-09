"use client"

import * as React from "react"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui"

export const CharacterStatsDashboard = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Character Stats Dashboard</h3>
      <p className="text-muted-foreground mb-4">
        RPG-style character progression and stats
      </p>
      <Badge variant="secondary">Tier 4</Badge>
    </Card>
  )
}

export default CharacterStatsDashboard

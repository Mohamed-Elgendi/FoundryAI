"use client"

import * as React from "react"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui"

export const SelfDiscoveryAssessment = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Self Discovery Assessment</h3>
      <p className="text-muted-foreground mb-4">
        Comprehensive self-assessment tools and analytics
      </p>
      <Badge variant="secondary">Tier 4</Badge>
    </Card>
  )
}

export default SelfDiscoveryAssessment

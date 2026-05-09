"use client"

import * as React from "react"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui"

export const FoundryAI = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">FoundryAI Platform</h3>
      <p className="text-muted-foreground mb-4">
        AI-powered business plan generation system
      </p>
      <Badge variant="secondary">Core Platform</Badge>
    </Card>
  )
}

export default FoundryAI

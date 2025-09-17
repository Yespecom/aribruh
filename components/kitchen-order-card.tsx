"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, ChefHat, CheckCircle, Users, Timer } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  notes?: string
}

interface KitchenOrder {
  orderId: string
  tableId: string
  tableName: string
  partitionNo: number
  items: OrderItem[]
  status: "pending" | "cooking" | "ready" | "served"
  timestamp: Date
  estimatedTime?: number
}

interface KitchenOrderCardProps {
  order: KitchenOrder
  onStatusUpdate: (orderId: string, newStatus: KitchenOrder["status"]) => void
}

export function KitchenOrderCard({ order, onStatusUpdate }: KitchenOrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-orange-200 bg-orange-50"
      case "cooking":
        return "border-blue-200 bg-blue-50"
      case "ready":
        return "border-green-200 bg-green-50"
      case "served":
        return "border-gray-200 bg-gray-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "cooking":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-800 bg-blue-100">
            <ChefHat className="h-3 w-3 mr-1" />
            Cooking
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="border-green-300 text-green-800 bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        )
      case "served":
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-800 bg-gray-100">
            <Users className="h-3 w-3 mr-1" />
            Served
          </Badge>
        )
      default:
        return null
    }
  }

  const getNextAction = () => {
    switch (order.status) {
      case "pending":
        return {
          label: "Start Cooking",
          action: () => onStatusUpdate(order.orderId, "cooking"),
          variant: "default" as const,
        }
      case "cooking":
        return {
          label: "Mark Ready",
          action: () => onStatusUpdate(order.orderId, "ready"),
          variant: "default" as const,
        }
      case "ready":
        return {
          label: "Mark Served",
          action: () => onStatusUpdate(order.orderId, "served"),
          variant: "default" as const,
        }
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getElapsedTime = () => {
    const now = new Date()
    const elapsed = Math.floor((now.getTime() - order.timestamp.getTime()) / (1000 * 60))
    return elapsed
  }

  const nextAction = getNextAction()
  const elapsedMinutes = getElapsedTime()

  return (
    <Card className={`${getStatusColor(order.status)} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="font-mono text-sm">{order.orderId}</span>
          </CardTitle>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {order.tableName} - Partition {order.partitionNo}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(order.timestamp)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <span className="font-medium">{item.name}</span>
                {item.notes && <div className="text-xs text-muted-foreground">{item.notes}</div>}
              </div>
              <Badge variant="secondary" className="ml-2">
                x{item.quantity}
              </Badge>
            </div>
          ))}
        </div>

        <Separator />

        {/* Time Information */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>Elapsed: {elapsedMinutes}m</span>
          </div>
          {order.estimatedTime && order.status === "cooking" && (
            <div className="flex items-center gap-1 text-blue-600">
              <Clock className="h-3 w-3" />
              <span>ETA: {order.estimatedTime}m</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {nextAction && (
          <Button onClick={nextAction.action} className="w-full" variant={nextAction.variant}>
            {nextAction.label}
          </Button>
        )}

        {/* Priority Indicator for Long Wait Times */}
        {elapsedMinutes > 20 && order.status !== "served" && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-700 font-medium">High Priority - Long Wait Time</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

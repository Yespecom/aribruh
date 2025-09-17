"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Clock, CheckCircle, Users, Utensils } from "lucide-react"
import { KitchenOrderCard } from "@/components/kitchen-order-card"

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

// Mock data for demonstration
const MOCK_ORDERS: KitchenOrder[] = [
  {
    orderId: "O001234",
    tableId: "T03",
    tableName: "Table 3",
    partitionNo: 1,
    items: [
      { id: "I101", name: "Grilled Chicken", quantity: 2 },
      { id: "I201", name: "Chicken Kebab", quantity: 1 },
    ],
    status: "pending",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    orderId: "O001235",
    tableId: "T05",
    tableName: "Table 5",
    partitionNo: 1,
    items: [
      { id: "I102", name: "Mutton Curry", quantity: 1 },
      { id: "I103", name: "Fish Fry", quantity: 2 },
    ],
    status: "cooking",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    estimatedTime: 10,
  },
  {
    orderId: "O001236",
    tableId: "T02",
    tableName: "Table 2",
    partitionNo: 2,
    items: [
      { id: "I202", name: "Paneer Tikka", quantity: 3 },
      { id: "I301", name: "Mango Lassi", quantity: 2 },
    ],
    status: "ready",
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
  },
  {
    orderId: "O001237",
    tableId: "T01",
    tableName: "Table 1",
    partitionNo: 1,
    items: [{ id: "I302", name: "Fresh Lime Soda", quantity: 4 }],
    status: "served",
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
  },
]

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>(MOCK_ORDERS)
  const [activeTab, setActiveTab] = useState("all")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "cooking" && order.estimatedTime && order.estimatedTime > 0) {
            return { ...order, estimatedTime: order.estimatedTime - 1 }
          }
          return order
        }),
      )
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              status: newStatus,
              estimatedTime: newStatus === "cooking" ? 15 : undefined,
            }
          : order,
      ),
    )
  }

  const getFilteredOrders = (status?: string) => {
    if (!status || status === "all") return orders
    return orders.filter((order) => order.status === status)
  }

  const getStatusCounts = () => {
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      cooking: orders.filter((o) => o.status === "cooking").length,
      ready: orders.filter((o) => o.status === "ready").length,
      served: orders.filter((o) => o.status === "served").length,
    }
  }

  const statusCounts = getStatusCounts()
  const filteredOrders = getFilteredOrders(activeTab)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="text-primary-foreground/80">Active Orders</div>
                <div className="text-xl font-bold">{statusCounts.pending + statusCounts.cooking}</div>
              </div>
              <div className="text-sm">
                <div className="text-primary-foreground/80">Ready to Serve</div>
                <div className="text-xl font-bold text-green-300">{statusCounts.ready}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-800">{statusCounts.pending}</div>
                    <div className="text-sm text-orange-600">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-800">{statusCounts.cooking}</div>
                    <div className="text-sm text-blue-600">Cooking</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-800">{statusCounts.ready}</div>
                    <div className="text-sm text-green-600">Ready</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-gray-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{statusCounts.served}</div>
                    <div className="text-sm text-gray-600">Served</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                {statusCounts.pending > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                    {statusCounts.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cooking" className="relative">
                Cooking
                {statusCounts.cooking > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500">
                    {statusCounts.cooking}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="ready" className="relative">
                Ready
                {statusCounts.ready > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500">
                    {statusCounts.ready}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="served">Served</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders in this category</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrders.map((order) => (
                    <KitchenOrderCard key={order.orderId} order={order} onStatusUpdate={updateOrderStatus} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

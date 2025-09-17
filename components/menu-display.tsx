"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Plus, Eye } from "lucide-react"
import { PartitionedCart } from "@/components/partitioned-cart"
import { PaymentFlow } from "@/components/payment-flow"
import Link from "next/link"

interface TableInfo {
  tableId: string
  tableName: string
}

interface MenuDisplayProps {
  tableInfo: TableInfo
  onBackToScanner: () => void
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

interface CartItem extends MenuItem {
  quantity: number
}

interface Partition {
  partition_no: number
  status: "open" | "confirmed"
  items: CartItem[]
  subtotal: number
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "I101",
    name: "Grilled Chicken",
    description: "Tender grilled chicken with herbs and spices",
    price: 250,
    category: "Main Course",
  },
  {
    id: "I102",
    name: "Mutton Curry",
    description: "Rich and flavorful mutton curry with traditional spices",
    price: 300,
    category: "Main Course",
  },
  {
    id: "I103",
    name: "Fish Fry",
    description: "Crispy fried fish with coastal spices",
    price: 200,
    category: "Main Course",
  },
  {
    id: "I201",
    name: "Chicken Kebab",
    description: "Juicy chicken kebabs grilled to perfection",
    price: 150,
    category: "Starters",
  },
  {
    id: "I202",
    name: "Paneer Tikka",
    description: "Marinated paneer cubes grilled with vegetables",
    price: 120,
    category: "Starters",
  },
  {
    id: "I301",
    name: "Mango Lassi",
    description: "Refreshing mango yogurt drink",
    price: 80,
    category: "Drinks",
  },
  {
    id: "I302",
    name: "Fresh Lime Soda",
    description: "Zesty lime soda with mint",
    price: 60,
    category: "Drinks",
  },
]

const CATEGORIES = ["Starters", "Main Course", "Drinks"]

export function MenuDisplay({ tableInfo, onBackToScanner }: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState("Starters")
  const [partitions, setPartitions] = useState<Partition[]>([])
  const [currentPartition, setCurrentPartition] = useState<Partition>({
    partition_no: 1,
    status: "open",
    items: [],
    subtotal: 0,
  })
  const [showCart, setShowCart] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const addToCart = (item: MenuItem) => {
    const existingItem = currentPartition.items.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      const updatedItems = currentPartition.items.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
      )
      updateCurrentPartition(updatedItems)
    } else {
      const newItem: CartItem = { ...item, quantity: 1 }
      updateCurrentPartition([...currentPartition.items, newItem])
    }
  }

  const updateCurrentPartition = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setCurrentPartition({
      ...currentPartition,
      items,
      subtotal,
    })
  }

  const handleProceedToPayment = () => {
    setShowCart(false)
    setShowPayment(true)
  }

  const filteredItems = MENU_ITEMS.filter((item) => item.category === selectedCategory)
  const totalItems = currentPartition.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBackToScanner}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scanner
        </Button>
        <Button variant="outline" onClick={() => setShowCart(true)} className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                <img
                  src={`/abstract-geometric-shapes.png?key=u1eud&height=120&width=200&query=${encodeURIComponent(item.name + " food dish")}`}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-accent">₹{item.price}</span>
                <Link href={`/item/${item.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </Link>
              </div>
              <Button onClick={() => addToCart(item)} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partitioned Cart Modal */}
      {showCart && (
        <PartitionedCart
          tableInfo={tableInfo}
          currentPartition={currentPartition}
          partitions={partitions}
          onClose={() => setShowCart(false)}
          onUpdatePartition={updateCurrentPartition}
          onConfirmPartition={(partition) => {
            setPartitions([...partitions, { ...partition, status: "confirmed" }])
            setCurrentPartition({
              partition_no: partitions.length + 2,
              status: "open",
              items: [],
              subtotal: 0,
            })
            setShowCart(false)
          }}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Payment Flow Modal */}
      {showPayment && (
        <PaymentFlow
          tableInfo={tableInfo}
          partitions={partitions}
          currentPartition={currentPartition.items.length > 0 ? currentPartition : null}
          onClose={() => setShowPayment(false)}
          onPaymentComplete={() => {
            setPartitions([])
            setCurrentPartition({
              partition_no: 1,
              status: "open",
              items: [],
              subtotal: 0,
            })
            setShowPayment(false)
          }}
        />
      )}
    </div>
  )
}

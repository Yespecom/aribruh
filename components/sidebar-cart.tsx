"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ShoppingCart, Check, Clock, Receipt, X } from "lucide-react"
import { OrderSummary } from "@/components/order-summary"
import { SidebarHeader, SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { useCart } from "@/contexts/cart-context"

interface TableInfo {
  tableId: string
  tableName: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Partition {
  partition_no: number
  status: "open" | "confirmed"
  items: CartItem[]
  subtotal: number
}

interface SidebarCartProps {
  tableInfo: TableInfo
  currentPartition: Partition
  partitions: Partition[]
  onUpdatePartition: (items: CartItem[]) => void
  onConfirmPartition: (partition: Partition) => void
  onProceedToPayment: () => void
}

export function SidebarCart({
  tableInfo,
  currentPartition,
  partitions,
  onUpdatePartition,
  onConfirmPartition,
  onProceedToPayment,
}: SidebarCartProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCompleteOrder, setShowCompleteOrder] = useState(false)
  const { toggleSidebar } = useSidebar()
  const { updateQuantity: updateGlobalQuantity } = useCart()

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    updateGlobalQuantity(itemId, newQuantity)
  }

  const handleConfirmPartition = () => {
    if (currentPartition.items.length > 0) {
      onConfirmPartition(currentPartition)
      setShowConfirmDialog(false)
    }
  }

  const handleCompleteOrder = () => {
    setShowCompleteOrder(true)
  }

  const grandTotal = partitions.reduce((sum, partition) => sum + partition.subtotal, 0) + currentPartition.subtotal
  const hasConfirmedPartitions = partitions.length > 0

  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold">Order Cart</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground">{tableInfo.tableName}</p>
        </div>
      </SidebarHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Confirmed Partitions */}
        {partitions.map((partition) => (
          <Card key={partition.partition_no} className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Partition {partition.partition_no}
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  Confirmed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partition.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-sm">
                  <span>Subtotal:</span>
                  <span>₹{partition.subtotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Current Partition */}
        {currentPartition.items.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Partition {currentPartition.partition_no}
                </CardTitle>
                <Badge variant="outline" className="border-blue-300 text-blue-800 text-xs">
                  Open
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentPartition.items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{item.name}</span>
                        <div className="text-xs text-muted-foreground">₹{item.price} each</div>
                      </div>
                      <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-sm">
                  <span>Subtotal:</span>
                  <span>₹{currentPartition.subtotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {currentPartition.items.length === 0 && partitions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Your cart is empty</p>
            <p className="text-xs">Add items from the menu to get started</p>
          </div>
        )}

        {/* Grand Total */}
        {(currentPartition.items.length > 0 || partitions.length > 0) && (
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Grand Total:</span>
                <span className="text-accent">₹{grandTotal}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-2">
          {currentPartition.items.length > 0 && (
            <Button onClick={() => setShowConfirmDialog(true)} className="w-full" size="sm">
              Confirm Partition {currentPartition.partition_no}
            </Button>
          )}
          {hasConfirmedPartitions && (
            <Button onClick={handleCompleteOrder} className="w-full bg-green-600 hover:bg-green-700" size="sm">
              <Receipt className="h-4 w-4 mr-2" />
              Complete Order
            </Button>
          )}
        </div>
      </SidebarFooter>

      {/* Confirm Partition Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Partition {currentPartition.partition_no}?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Once confirmed, this partition will be sent to the kitchen and cannot be modified. You can continue adding
              items to a new partition.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="font-medium mb-2 text-sm">Items in this partition:</div>
              {currentPartition.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-sm">
                <span>Subtotal:</span>
                <span>₹{currentPartition.subtotal}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirmPartition} className="flex-1">
                Confirm & Send to Kitchen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Summary Dialog for complete order flow */}
      {showCompleteOrder && (
        <OrderSummary
          tableInfo={tableInfo}
          partitions={partitions}
          currentPartition={currentPartition.items.length > 0 ? currentPartition : null}
          onClose={() => setShowCompleteOrder(false)}
          onProceedToPayment={() => {
            setShowCompleteOrder(false)
            onProceedToPayment()
          }}
        />
      )}
    </>
  )
}

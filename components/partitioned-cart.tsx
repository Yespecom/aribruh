"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ShoppingCart, Check, Clock, Receipt } from "lucide-react"
import { OrderSummary } from "@/components/order-summary"

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

interface PartitionedCartProps {
  tableInfo: TableInfo
  currentPartition: Partition
  partitions: Partition[]
  onClose: () => void
  onUpdatePartition: (items: CartItem[]) => void
  onConfirmPartition: (partition: Partition) => void
}

export function PartitionedCart({
  tableInfo,
  currentPartition,
  partitions,
  onClose,
  onUpdatePartition,
  onConfirmPartition,
}: PartitionedCartProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCompleteOrder, setShowCompleteOrder] = useState(false)

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const updatedItems = currentPartition.items.filter((item) => item.id !== itemId)
      onUpdatePartition(updatedItems)
    } else {
      const updatedItems = currentPartition.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      )
      onUpdatePartition(updatedItems)
    }
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
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Cart - {tableInfo.tableName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Confirmed Partitions */}
            {partitions.map((partition) => (
              <Card key={partition.partition_no} className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Partition {partition.partition_no}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Confirmed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {partition.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Partition {currentPartition.partition_no}
                    </CardTitle>
                    <Badge variant="outline" className="border-blue-300 text-blue-800">
                      Open
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentPartition.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <div className="text-sm text-muted-foreground">₹{item.price} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="w-16 text-right font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
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
                <p>Your cart is empty</p>
                <p className="text-sm">Add items from the menu to get started</p>
              </div>
            )}

            {/* Grand Total */}
            {(currentPartition.items.length > 0 || partitions.length > 0) && (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Grand Total:</span>
                    <span className="text-accent">₹{grandTotal}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Continue Shopping
              </Button>
              {currentPartition.items.length > 0 && (
                <Button onClick={() => setShowConfirmDialog(true)} className="flex-1">
                  Confirm Partition {currentPartition.partition_no}
                </Button>
              )}
              {hasConfirmedPartitions && (
                <Button onClick={handleCompleteOrder} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Receipt className="h-4 w-4 mr-2" />
                  Complete Order
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Partition Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Partition {currentPartition.partition_no}?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Once confirmed, this partition will be sent to the kitchen and cannot be modified. You can continue adding
              items to a new partition.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="font-medium mb-2">Items in this partition:</div>
              {currentPartition.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
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
            onClose()
            // This will be handled by the parent component
          }}
        />
      )}
    </>
  )
}

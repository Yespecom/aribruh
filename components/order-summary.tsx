"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Receipt, Clock, Check, AlertTriangle, CreditCard } from "lucide-react"

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

interface OrderSummaryProps {
  tableInfo: TableInfo
  partitions: Partition[]
  currentPartition: Partition | null
  onClose: () => void
  onProceedToPayment: () => void
}

export function OrderSummary({
  tableInfo,
  partitions,
  currentPartition,
  onClose,
  onProceedToPayment,
}: OrderSummaryProps) {
  const [showWarning, setShowWarning] = useState(!!currentPartition)

  const confirmedPartitions = partitions
  const allPartitions = currentPartition ? [...confirmedPartitions, currentPartition] : confirmedPartitions

  const grandTotal = allPartitions.reduce((sum, partition) => sum + partition.subtotal, 0)
  const taxAmount = Math.round(grandTotal * 0.18) // 18% GST
  const finalTotal = grandTotal + taxAmount

  const handleProceedToPayment = () => {
    if (currentPartition) {
      // Show warning about unconfirmed partition
      setShowWarning(true)
    } else {
      onProceedToPayment()
    }
  }

  const generateOrderId = () => {
    return `O${Date.now().toString().slice(-6)}`
  }

  const orderId = generateOrderId()

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Summary - {tableInfo.tableName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Header */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID:</span>
                    <div className="font-mono font-bold">{orderId}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Table:</span>
                    <div className="font-bold">{tableInfo.tableName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <div>{new Date().toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <div>{new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partition Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Breakdown</h3>

              {allPartitions.map((partition) => (
                <Card
                  key={partition.partition_no}
                  className={
                    partition.status === "confirmed" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {partition.status === "confirmed" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-600" />
                        )}
                        Partition {partition.partition_no}
                      </CardTitle>
                      <Badge
                        variant={partition.status === "confirmed" ? "secondary" : "outline"}
                        className={
                          partition.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "border-orange-300 text-orange-800"
                        }
                      >
                        {partition.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {partition.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{item.price * item.quantity}</div>
                            <div className="text-xs text-muted-foreground">₹{item.price} each</div>
                          </div>
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
            </div>

            {/* Bill Summary */}
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Bill Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({allPartitions.length} partition{allPartitions.length > 1 ? "s" : ""}):
                  </span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{taxAmount}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Final Total:</span>
                  <span className="text-accent">₹{finalTotal}</span>
                </div>
              </CardContent>
            </Card>

            {/* Warning for unconfirmed partition */}
            {currentPartition && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-800">Unconfirmed Partition</div>
                      <p className="text-sm text-orange-700 mt-1">
                        Partition {currentPartition.partition_no} is still open. Items in this partition will be
                        included in your final bill but won't be sent to the kitchen until confirmed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Back to Cart
              </Button>
              <Button onClick={handleProceedToPayment} className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog for Unconfirmed Partition */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Unconfirmed Partition
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You have an unconfirmed partition with items that haven't been sent to the kitchen yet. You can either:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Option 1: Proceed with payment</div>
                <p className="text-sm text-muted-foreground">
                  Include unconfirmed items in your bill (they won't be prepared)
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Option 2: Go back and confirm</div>
                <p className="text-sm text-muted-foreground">Confirm the partition to send items to kitchen first</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowWarning(false)} className="flex-1">
                Go Back
              </Button>
              <Button
                onClick={() => {
                  setShowWarning(false)
                  onProceedToPayment()
                }}
                className="flex-1"
              >
                Proceed Anyway
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

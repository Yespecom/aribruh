"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Banknote, Smartphone, CheckCircle, Loader2 } from "lucide-react"

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

interface PaymentFlowProps {
  tableInfo: TableInfo
  partitions: Partition[]
  currentPartition: Partition | null
  onClose: () => void
  onPaymentComplete: () => void
}

export function PaymentFlow({ tableInfo, partitions, currentPartition, onClose, onPaymentComplete }: PaymentFlowProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const allPartitions = currentPartition ? [...partitions, currentPartition] : partitions
  const grandTotal = allPartitions.reduce((sum, partition) => sum + partition.subtotal, 0)
  const taxAmount = Math.round(grandTotal * 0.18) // 18% GST
  const finalTotal = grandTotal + taxAmount

  const generateOrderId = () => {
    return `O${Date.now().toString().slice(-6)}`
  }

  const orderId = generateOrderId()

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setPaymentComplete(true)

    // Auto close after showing success
    setTimeout(() => {
      onPaymentComplete()
    }, 2000)
  }

  const paymentMethods = [
    {
      id: "upi" as const,
      name: "UPI Payment",
      description: "Pay using UPI apps like GPay, PhonePe, Paytm",
      icon: Smartphone,
    },
    {
      id: "card" as const,
      name: "Card Payment",
      description: "Credit or Debit Card",
      icon: CreditCard,
    },
    {
      id: "cash" as const,
      name: "Cash Payment",
      description: "Pay with cash at the counter",
      icon: Banknote,
    },
  ]

  if (paymentComplete) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">Your order has been confirmed and sent to the kitchen.</p>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-800">
                <div>
                  Order ID: <span className="font-mono font-bold">{orderId}</span>
                </div>
                <div>
                  Amount Paid: <span className="font-bold">₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment - {tableInfo.tableName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Order ID:</span>
                <span className="font-mono font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Table:</span>
                <span className="font-bold">{tableInfo.tableName}</span>
              </div>
              <Separator />
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
                <span>Total Amount:</span>
                <span className="text-accent">₹{finalTotal}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <method.icon className="h-5 w-5 text-accent" />
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="text-sm">
                {paymentMethod === "upi" && (
                  <div>
                    <div className="font-medium mb-2">UPI Payment Instructions:</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Scan the QR code that will appear after clicking "Pay Now"</li>
                      <li>• Or use UPI ID: restaurant@upi</li>
                      <li>• Enter amount: ₹{finalTotal}</li>
                    </ul>
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div>
                    <div className="font-medium mb-2">Card Payment Instructions:</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• You will be redirected to secure payment gateway</li>
                      <li>• Enter your card details</li>
                      <li>• Complete OTP verification</li>
                    </ul>
                  </div>
                )}
                {paymentMethod === "cash" && (
                  <div>
                    <div className="font-medium mb-2">Cash Payment Instructions:</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Please visit the billing counter</li>
                      <li>• Show this order ID: {orderId}</li>
                      <li>• Pay ₹{finalTotal} in cash</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handlePayment} className="flex-1" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${finalTotal}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

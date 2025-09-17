"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Camera, Hash } from "lucide-react"

interface QRScannerProps {
  onScan: (tableId: string) => void
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [manualTableId, setManualTableId] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const handleManualEntry = () => {
    if (manualTableId.trim()) {
      onScan(manualTableId.trim())
    }
  }

  const simulateQRScan = () => {
    setIsScanning(true)
    // Simulate QR scan delay
    setTimeout(() => {
      setIsScanning(false)
      // Simulate scanning table T03
      onScan("T03")
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Welcome to RestaurantOS</CardTitle>
          <p className="text-muted-foreground">Scan your table's QR code to start ordering</p>
        </CardHeader>
      </Card>

      {/* QR Scanner Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {isScanning ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <QrCode className="h-16 w-16 text-accent mx-auto mb-2" />
                </div>
                <p className="text-sm text-muted-foreground">Scanning...</p>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Point camera at QR code</p>
              </div>
            )}

            {/* Scanning overlay */}
            {isScanning && <div className="absolute inset-0 border-2 border-accent rounded-lg animate-pulse" />}
          </div>

          <Button onClick={simulateQRScan} className="w-full" disabled={isScanning}>
            {isScanning ? "Scanning..." : "Start QR Scan (Demo)"}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Entry Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Manual Table Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter table ID (e.g., T01)"
              value={manualTableId}
              onChange={(e) => setManualTableId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleManualEntry()}
            />
            <Button onClick={handleManualEntry} variant="outline">
              Go
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">For demo: Try T01, T02, T03, etc.</p>
        </CardContent>
      </Card>
    </div>
  )
}

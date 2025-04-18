"use client"

import { useState, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
}

export function QRScanner({ isOpen, onClose }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null

    const startScanner = async () => {
      if (!isOpen) return

      const qrCodeId = "qr-reader"

      // Make sure the element exists before initializing
      const element = document.getElementById(qrCodeId)
      if (!element) return

      try {
        html5QrCode = new Html5Qrcode(qrCodeId)

        await html5QrCode
          .start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              // On successful scan
              setScanResult(decodedText)
              if (html5QrCode) {
                html5QrCode.stop().catch((error) => console.error("Error stopping QR scanner:", error))
              }

              // Extract certificate ID from URL if it's a URL
              let certificateId = decodedText
              try {
                const url = new URL(decodedText)
                const pathParts = url.pathname.split("/")
                certificateId = pathParts[pathParts.length - 1]
              } catch (e) {
                // Not a URL, use as is
              }

              // Navigate to certificate page
              router.push(`/certificate/${certificateId}`)
              onClose()
            },
            (errorMessage) => {
              // On error
              console.log(errorMessage)
            },
          )
          .catch((err) => {
            console.error("Error starting QR scanner:", err)
          })
      } catch (error) {
        console.error("QR Scanner initialization error:", error)
      }
    }

    if (isOpen) {
      startScanner()
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((error) => console.error("Error stopping QR scanner:", error))
      }
    }
  }, [isOpen, onClose, router])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sertifikat QR kodini skanerlang</DialogTitle>
          <DialogDescription>Kamerangizni QR kodga yo'naltiring</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div id="qr-reader" style={{ width: "100%", maxWidth: "300px" }}></div>
          {scanResult && <p className="text-sm text-muted-foreground">Natija: {scanResult}</p>}
          <Button onClick={onClose} variant="outline">
            Bekor qilish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

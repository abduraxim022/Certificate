"use client"
import type React from "react"
import { CheckCircle, QrCode, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCertificateById, searchCertificates } from "@/lib/certificate-data"
import { useRouter } from "next/navigation"
import { QRScanner } from "@/components/qr-scanner"
import { Card, CardContent } from "@/components/ui/card"
import Logo from '../images/altimage.png'

export default function CertificateSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [exactMatch, setExactMatch] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setExactMatch(null)
      return
    }

    setIsSearching(true)

    const exactCertificate = getCertificateById(searchQuery.trim())
    setExactMatch(exactCertificate || null)

    const results = searchCertificates(searchQuery)
    setSearchResults(results.filter((cert) => cert.id !== searchQuery.trim()))

    setIsSearching(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" width={40} height={40} className="rounded-md" />
            <span className="text-xl font-bold">Unicorn Check Certificate</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsQRScannerOpen(true)}>
            <QrCode className="h-5 w-5" />
            <span className="sr-only">Scan QR Code</span>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Sertifikat ID bo'yicha tekshirish
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Sertifikat ID raqamini kiritib, uning raqamli variantini koring
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <div className="flex w-full max-w-md items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Sertifikat ID raqamini kiriting"
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button onClick={handleSearch} disabled={isSearching}>
                    <Search className="mr-2 h-4 w-4" />
                    {isSearching ? "Qidirilmoqda..." : "Qidirish"}
                  </Button>
                </div>

                {/* Exact Match Result */}
                {exactMatch && (
                  <Card className="mt-6 overflow-hidden border-2 border-primary">
                    <CardContent className="p-0">
                      <div className="bg-primary/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Sertifikat topildi</h3>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/certificate/${exactMatch.id}`}>Batafsil ko'rish</Link>
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground">Sertifikat ID:</p>
                          <p className="font-medium">{exactMatch.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sertifikat egasi:</p>
                          <p className="text-xl font-bold">{exactMatch.holderName}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Sertifikat turi:</p>
                          <p className="font-medium">{exactMatch.type}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Holati:</p>
                          <div className="flex items-center gap-1">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                exactMatch.status === "valid"
                                  ? "bg-green-500"
                                  : exactMatch.status === "expired"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                            ></span>
                            <span className="font-medium">
                              {exactMatch.status === "valid"
                                ? "Haqiqiy"
                                : exactMatch.status === "expired"
                                  ? "Muddati tugagan"
                                  : "Bekor qilingan"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Similar Results */}
                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 font-medium">O'xshash natijalar:</h3>
                    <ul className="space-y-2">
                      {searchResults.map((cert) => (
                        <li key={cert.id} className="rounded-md border p-3 hover:bg-muted">
                          <Link href={`/certificate/${cert.id}`} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">ID: {cert.id}</p>
                              <p className="text-sm text-muted-foreground">{cert.holderName}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Ko'rish
                            </Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Image src={Logo} alt="Logo" width={32} height={32} className="rounded-md" />
            <p className="text-center text-sm leading-loose md:text-left">
              &copy; {new Date().getFullYear()} Unicorn. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </footer>
      <QRScanner isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />
    </div>
  )
}

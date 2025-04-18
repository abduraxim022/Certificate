"use client"

import { ArrowLeft, Calendar, CheckCircle, Download, Share2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCertificateById, type Certificate } from "@/lib/certificate-data"
import { QRCodeGenerator } from "@/components/qr-code"
import { useRouter } from "next/navigation"

interface CertificateDetailsProps {
  params: {
    id: string
  }
}

export default function CertificateDetailsPage({ params }: CertificateDetailsProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const cert = getCertificateById(params.id)
    if (cert) {
      setCertificate(cert)
    } else {
      setNotFound(true)
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500"
      case "expired":
        return "bg-amber-500"
      case "revoked":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Generate the full URL for the certificate
  const certificateUrl =
    typeof window !== "undefined" ? `${window.location.origin}/certificate/${params.id}` : `/certificate/${params.id}`

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b bg-background">
          <div className="container flex h-16 items-center px-4 sm:px-8">
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="text-xl font-bold">CertSearch</span>
            </div>
          </div>
        </header>
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Qidiruv sahifasiga qaytish
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <h1 className="text-2xl font-bold">Sertifikat topilmadi</h1>
              <p className="text-muted-foreground">Kechirasiz, siz qidirayotgan sertifikat mavjud emas.</p>
              <Button asChild>
                <Link href="/">Qidiruv sahifasiga qaytish</Link>
              </Button>
            </div>
          </div>
        </main>
        <footer className="border-t bg-background">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <p className="text-center text-sm leading-loose md:text-left">
                &copy; {new Date().getFullYear()} CertSearch. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-md" />
            <span className="text-xl font-bold">CertSearch</span>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Qidiruv sahifasiga qaytish
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="relative pb-2">
                  <div className="absolute right-6 top-6">
                    <Badge variant={certificate.status === "valid" ? "default" : "destructive"} className="text-xs">
                      {certificate.status === "valid"
                        ? "Haqiqiy"
                        : certificate.status === "expired"
                          ? "Muddati tugagan"
                          : "Bekor qilingan"}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Sertifikat ma'lumotlari</CardTitle>
                  <CardDescription>
                    Sertifikat raqami: <span className="font-medium">{certificate.id}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Sertifikat egasi</p>
                        <p className="font-medium">{certificate.holderName}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Berilgan sana</p>
                          <p className="font-medium">{formatDate(certificate.issueDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Amal qilish muddati</p>
                          <p className="font-medium">{formatDate(certificate.expiryDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-semibold">Sertifikat haqida</h3>
                    <p className="text-muted-foreground">{certificate.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Erishilgan ko'nikmalar</h3>
                    <ul className="ml-6 list-disc text-muted-foreground">
                      {certificate.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Yuklab olish
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Ulashish
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Sertifikat tasdiqlangan</CardTitle>
                  <CardDescription>Sertifikat haqiqiyligi tekshirildi</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full ${getStatusColor(certificate.status)}`}
                  >
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Sertifikat beruvchi tashkilot:</p>
                    <p className="text-muted-foreground">{certificate.issuingOrganization}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex w-full justify-between">
                    <span className="text-sm text-muted-foreground">Sertifikat turi:</span>
                    <span className="text-sm font-medium">{certificate.type}</span>
                  </div>
                  <div className="flex w-full justify-between">
                    <span className="text-sm text-muted-foreground">Kategoriya:</span>
                    <span className="text-sm font-medium">{certificate.category}</span>
                  </div>
                </CardFooter>
              </Card>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sertifikatni tekshirish</CardTitle>
                    <CardDescription>QR kod orqali sertifikatni tekshirish</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-6">
                    <QRCodeGenerator value={certificateUrl} size={150} />
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Sertifikat haqiqiyligini tekshirish uchun QR kodni skanerlang
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} className="rounded-md" />
            <p className="text-center text-sm leading-loose md:text-left">
              &copy; {new Date().getFullYear()} CertSearch. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

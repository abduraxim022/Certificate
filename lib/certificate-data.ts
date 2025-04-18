export interface Certificate {
  id: string
  holderName: string
  issueDate: string
  expiryDate: string
  issuingOrganization: string
  status: "valid" | "expired" | "revoked"
  type: string
  category: string
  description: string
  achievements: string[]
}

export const sampleCertificates: Certificate[] = [
  {
    id: "CERT-123456",
    holderName: "Abdulaziz Karimov",
    issueDate: "2023-05-15",
    expiryDate: "2026-05-14",
    issuingOrganization: "O'zbekiston Respublikasi Ta'lim Vazirligi",
    status: "valid",
    type: "Professional Certificate",
    category: "Information Technology",
    description:
      "Bu sertifikat egasi Web dasturlash sohasida professional bilim va ko'nikmalarga ega ekanligini tasdiqlovchi hujjat hisoblanadi.",
    achievements: ["Frontend dasturlash", "Backend dasturlash", "Database boshqaruvi", "API integratsiyasi"],
  },
  {
    id: "CERT-789012",
    holderName: "Malika Rahimova",
    issueDate: "2022-09-10",
    expiryDate: "2025-09-09",
    issuingOrganization: "O'zbekiston Davlat Universiteti",
    status: "valid",
    type: "Academic Degree",
    category: "Computer Science",
    description:
      "Bu sertifikat egasi Kompyuter fanlari bo'yicha bakalavr darajasiga ega ekanligini tasdiqlovchi hujjat hisoblanadi.",
    achievements: [
      "Algoritm va ma'lumotlar strukturasi",
      "Dasturlash tillari",
      "Kompyuter tarmoqlari",
      "Sun'iy intellekt asoslari",
    ],
  },
  {
    id: "CERT-345678",
    holderName: "Rustam Aliyev",
    issueDate: "2021-03-22",
    expiryDate: "2023-03-21",
    issuingOrganization: "Digital Skills Academy",
    status: "expired",
    type: "Course Completion",
    category: "Digital Marketing",
    description:
      "Bu sertifikat egasi Raqamli marketing kursi dasturini muvaffaqiyatli yakunlaganligini tasdiqlovchi hujjat hisoblanadi.",
    achievements: ["SMM strategiyasi", "Kontentni boshqarish", "SEO optimizatsiya", "Reklama kampaniyalari"],
  },
]

export function getCertificateById(id: string): Certificate | undefined {
  return sampleCertificates.find((cert) => cert.id.toLowerCase() === id.toLowerCase())
}

export function searchCertificates(query: string): Certificate[] {
  if (!query) return []

  const normalizedQuery = query.toLowerCase().trim()
  return sampleCertificates.filter((cert) => cert.id.toLowerCase().includes(normalizedQuery))
}

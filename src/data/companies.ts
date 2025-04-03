import type { Company } from "@lib/types";

export const COMPANIES: Company[] = [
  {
    "id": 1,
    "name": "Madrid",
    "telephone": "+34 913 274 051",
    "address": "Sta. Leonor, 53",
    "zipCode": "28037",
    "city": "Madrid"
  },
  {
    "id": 2,
    "name": "Barcelona",
    "telephone": "+34 934 119 156",
    "address": "Roger, 65",
    "zipCode": "08028",
    "city": "Barcelona"
  },
  {
    "id": 3,
    "name": "Bilbao",
    "telephone": "+34 944 359 642",
    "address": "Gran Vía, 19",
    "zipCode": "48001",
    "city": "Bilbao"
  },
  {
    "id": 4,
    "name": "Málaga",
    "telephone": "+34 951 231 529",
    "address": "C/Marqués de Larios, 4, planta 1",
    "zipCode": "29005",
    "city": "Málaga"
  }
] as const
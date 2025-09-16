import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  const radiusKm = Number(searchParams.get('radiusKm') || 10)

  if (!(Number.isFinite(lat) && Number.isFinite(lng))) {
    return NextResponse.json({ error: 'lat/lng inválidos' }, { status: 400 })
  }

  // Bounding box rápida para reduzir dataset
  const latDelta = radiusKm / 111 // ~111km por grau
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180))

  const minLat = lat - latDelta
  const maxLat = lat + latDelta
  const minLng = lng - lngDelta
  const maxLng = lng + lngDelta

  const candidates = await prisma.user.findMany({
    where: {
      status: true,
      latitude: { not: null, gte: minLat, lte: maxLat },
      longitude: { not: null, gte: minLng, lte: maxLng },
    },
    include: { subscription: true },
  })

  const withDistance = candidates
    .map((u) => {
      const d = haversineKm(lat, lng, u.latitude!, u.longitude!)
      return { ...u, distanceKm: d }
    })
    .filter((u) => u.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 50)

  return NextResponse.json(withDistance)
}

'use client'

import { useEffect, useState } from 'react'
import { Professionals } from './professionals'

type Professional = Parameters<typeof Professionals>[0]['professionals'][number]

interface ProfessionalsNearbyProps {
  fallback: Professional[]
}

export function ProfessionalsNearby({ fallback }: ProfessionalsNearbyProps) {
  const [items, setItems] = useState<Professional[] | null>(null)

  useEffect(() => {
    async function loadFallback() {
      try {
        setItems(fallback)
      } catch (err) {
        console.error('[ProfessionalsNearby] Fallback falhou', err)
      }
    }
    if (!navigator.geolocation) {
      console.warn(
        '[ProfessionalsNearby] Geolocalização não suportada pelo navegador'
      )
      loadFallback().catch((err) =>
        console.error('[ProfessionalsNearby] Fallback erro inicial', err)
      )
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const radiusKm = 10 // ajuste conforme necessário ou torne configurável
          const res = await fetch(
            `/api/professionals/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
          )
          if (!res.ok) {
            console.error(
              '[ProfessionalsNearby] Falha ao buscar clínicas próximas (HTTP)',
              res.status
            )
            return
          }
          const data = await res.json()
          setItems(data)
        } catch (err) {
          console.error(
            '[ProfessionalsNearby] Erro ao buscar clínicas próximas',
            err
          )
          await loadFallback()
          return
        }
      },
      (err) => {
        console.error(
          '[ProfessionalsNearby] Não foi possível obter sua localização',
          err
        )
        loadFallback().catch((e) =>
          console.error('[ProfessionalsNearby] Fallback erro (permissão)', e)
        )
      },
      { enableHighAccuracy: false, timeout: 20_000, maximumAge: 300_000 }
    )
  }, [fallback])

  return <Professionals professionals={items ?? fallback} />
}

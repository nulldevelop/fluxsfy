'use client'

import { useEffect, useState } from 'react'

export function PwaInstaller() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show after 3 seconds
    const timer = setTimeout(() => {
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  function handleInstall() {
    alert(
      'Para instalar no iPhone:\n\n1. Toque no botão Compartilhar (+) abaixo\n2. Role até "Adicionar à Tela de Início"\n3. Toque em "Adicionar"'
    )
    setShow(false)
  }

  function handleClose() {
    setShow(false)
  }

  async function shareApp() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fluxsfy',
          text: 'Acesse minha agenda',
          url: window.location.href,
        })
      }
    } catch (e) {
      // User cancelled or not supported
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2_147_483_647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '1rem',
        cursor: 'pointer',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#18181b',
          border: '1px solid #3f3f46',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          maxWidth: '20rem',
          width: '100%',
          cursor: 'default',
        }}
      >
        <div
          style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '9999px',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
          }}
        >
          📱
        </div>

        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
          }}
        >
          Instalar App
        </h2>
        <p
          style={{
            color: '#a1a1aa',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}
        >
          Tenha o Fluxsfy sempre disponível no seu celular!
        </p>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <button
            onClick={handleInstall}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '9999px',
              backgroundColor: '#f59e0b',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Instalar Agora
          </button>

          <button
            onClick={shareApp}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '9999px',
              border: '1px solid #3f3f46',
              backgroundColor: 'transparent',
              color: '#d4d4d8',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Compartilhar
          </button>

          <button
            onClick={handleClose}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}

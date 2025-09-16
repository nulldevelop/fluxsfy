import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { Hero } from './_components/hero'
import { ProfessionalsNearby } from './_components/professionals-nearby'
import { getProfessionals } from './_data-access/get-professionals'

export const revalidate = 60 // 2 minutes

export default async function Home() {
  const fallbackProfessionals = await getProfessionals()

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <div>
        <Hero />

        {/* Renderiza uma única seção: usa proximidade se disponível, senão fallback SSR */}
        <div className='space-y-8'>
          <ProfessionalsNearby fallback={fallbackProfessionals || []} />
        </div>

        <Footer />
      </div>
    </div>
  )
}

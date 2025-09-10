import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { Hero } from './_components/hero'
import { Professionals } from './_components/professionals'
import { getProfessionals } from './_data-access/get-professionals'

export const revalidate = 120 // 2 minutes

export default async function Home() {
  const professionals = await getProfessionals()

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <div>
        <Hero />

        <Professionals professionals={professionals || []} />

        <Footer />
      </div>
    </div>
  )
}

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 pt-20 pb-4 sm:px-6 sm:pb-0 lg:px-8">
        <main className="flex items-center justify-center">
          <article className="flex max-w-3xl flex-[2] flex-col justify-center space-y-8">
            <h1 className="max-w-2xl font-bold text-4xl tracking-tight lg:text-5xl">
              Encontre os melhores profissionais em um único local!
            </h1>
            <p className="text-base text-gray-600 md:text-lg">
              Nós somos uma plataforma para profissionais da saúde com foco em
              agilizar seu atendimento de forma simplificada e organizada.
            </p>

            <Button className="w-fit bg-emerald-500 px-6 font-semibold hover:bg-emerald-400">
              Encontre uma clinica
            </Button>
          </article>

          <div className="hidden lg:block">
            <Image
              alt="Foto ilustrativa de um profissional de saude"
              className="object-contain"
              height={400}
              priority
              quality={100}
              src="/medic2.png"
              width={340}
            />
          </div>
        </main>
      </div>
    </section>
  );
}

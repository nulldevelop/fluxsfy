import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@prisma/client';

interface ProfessionalsProps {
  professionals: User[]
}

export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center font-bold text-3xl">
          Clinicas disponíveis
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((clinic) => (
            <Card className="overflow-hidden hover:shadow-lg duration-200" key={clinic.id}>
            <CardContent className="p-0">
              <div>
                <div className="relative h-48">
                  <Image
                    alt="Foto da clinica"
                    className="object-cover w-full h-full"
                    fill
                    src={clinic.image || '/medic1.png'}
                  />
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{clinic.name}</h3>
                    <p className="text-gray-500 text-sm">
                     {clinic.address}
                    </p>
                  </div>

                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>

                <Link
                  className="flex w-full items-center justify-center rounded-md bg-emerald-500 py-2 font-medium text-sm text-white hover:bg-emerald-400 md:text-base"
                  href={`/clinica/${clinic.id}`}
                  target='_blank'
                >
                  Agendar horário
                  <ArrowRight className="ml-2" />
                </Link>
              </div>
            </CardContent>
          </Card>
          ))}
        </section>
      </div>
    </section>
  );
}

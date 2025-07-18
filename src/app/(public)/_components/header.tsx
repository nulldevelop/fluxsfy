'use client';

import { LogIn, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../../../components/ui/button';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // biome-ignore lint/suspicious/noEvolvingTypes: dev
  const session = null;

  const navItems = [{ href: '#profissionais', label: 'Profissionais' }];

  // biome-ignore lint/nursery/noNestedComponentDefinitions: dev
  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          asChild
          className="bg-transparent text-black shadow-none hover:bg-transparent"
          key={item.href}
          onClick={() => setIsOpen(false)}
        >
          <Link className="text-base" href={item.href}>
            {item.label}
          </Link>
        </Button>
      ))}

      {session ? (
        <Link
          className="flex items-center justify-center gap-2 p-4"
          href="/dashboard"
        >
          Acessar clinica
        </Link>
      ) : (
        <Button className="p-4">
          <LogIn />
          Portal da clinica
        </Button>
      )}
    </>
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] bg-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="font-bold text-3xl text-zinc-900" href="/">
          NE<span className="text-emerald-500">Odonto</span>
        </Link>

        <nav className="hidden items-center space-x-4 md:flex">
          <NavLinks />
        </nav>

        <Sheet onOpenChange={setIsOpen} open={isOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-black hover:bg-transparent"
              size="icon"
              variant="ghost"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            className="z-[9999] w-[240px] sm:w-[300px]"
            side="right"
          >
            <SheetTitle>Menu</SheetTitle>
            <SheetHeader />

            <SheetDescription>Veja nossos links</SheetDescription>

            <nav className="mt-6 flex flex-col space-y-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

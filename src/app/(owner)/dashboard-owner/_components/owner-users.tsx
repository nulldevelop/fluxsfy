'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { setUserRole, toggleUserStatus } from '../_actions/update-user'
import { getUsersWithSubscription } from '../_data-access/get-users'

type UserRow = Awaited<ReturnType<typeof getUsersWithSubscription>>[number]
const SKELETON_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5', 'row-6']

export function OwnerUsers() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const data = await getUsersWithSubscription()
      setUsers(data)
      setLoading(false)
    })()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return users
    }
    return users.filter((u) =>
      [u.name ?? '', u.email ?? '', String(u.plan ?? ''), u.role]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [users, query])

  const handleToggle = async (id: string) => {
    await toggleUserStatus(id)
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u))
    )
  }

  const handleRole = async (id: string, role: 'USER' | 'ADMIN') => {
    await setUserRole(id, role)
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  return (
    <Card className='p-6 border-l-8 border-gold bg-black'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='font-bebas text-4xl text-gold tracking-widest uppercase'>Controle de Usuários</h2>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <input
            className='w-full bg-zinc-900 border border-zinc-800 rounded-none px-4 py-2 text-sm text-cream outline-none focus:border-gold sm:w-80 font-barlow font-bold uppercase tracking-widest'
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Buscar por nome, email, plano..'
            value={query}
          />
        </div>
      </div>
      <Separator className='mb-6 bg-gold/20' />
      <ScrollArea className='h-[70vh] pr-4'>
        <table className='w-full border-collapse text-sm font-barlow'>
          <thead className='sticky top-0 z-10 bg-black'>
            <tr className='text-left text-gold font-bold uppercase tracking-widest border-b border-gold/30'>
              <th className='py-4 pr-3'>Nome</th>
              <th className='py-4 pr-3'>Email</th>
              <th className='py-4 pr-3'>Plano</th>
              <th className='py-4 pr-3'>Status</th>
              <th className='py-4 pr-3'>Serv.</th>
              <th className='py-4 pr-3'>Agend.</th>
              <th className='py-4 pr-3'>Role</th>
              <th className='py-4 pr-3'>Ativo</th>
              <th className='py-4 pr-3 text-right'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              SKELETON_KEYS.map((key) => (
                <tr className='border-zinc-900 border-b' key={key}>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-4 w-28 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-4 w-40 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-4 w-20 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-4 w-24 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-4 w-10 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-4 w-10 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-6 w-16 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-6 w-12 bg-zinc-800' />
                  </td>
                  <td className='py-4 pr-3'>
                    <Skeleton className='h-8 w-20 bg-zinc-800 ml-auto' />
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td className='py-12 text-center text-zinc-500 font-bold uppercase tracking-widest' colSpan={9}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((u, idx) => (
                <tr
                  className={
                    'border-zinc-900 border-b hover:bg-zinc-900/50 transition-colors ' +
                    (idx % 2 === 1 ? 'bg-zinc-900/20' : '')
                  }
                  key={u.id}
                >
                  <td className='py-4 pr-3 text-cream font-bold'>{u.name ?? '-'}</td>
                  <td className='py-4 pr-3 text-zinc-400'>{u.email}</td>
                  <td className='py-4 pr-3'>
                    <span className='inline-block px-2 py-0.5 bg-zinc-800 text-gold text-[10px] font-bold uppercase tracking-widest'>
                      {u.plan ?? '-'}
                    </span>
                  </td>
                  <td className='py-4 pr-3'>
                    <span
                      className={
                        'inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ' +
                        (u.subscriptionStatus === 'active'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-barber-red/20 text-barber-red')
                      }
                    >
                      {u.subscriptionStatus ?? '-'}
                    </span>
                  </td>
                  <td className='py-4 pr-3 text-cream'>{u.servicesCount}</td>
                  <td className='py-4 pr-3 text-cream'>{u.appointmentsCount}</td>
                  <td className='py-4 pr-3'>
                    <select
                      className='bg-zinc-900 border border-zinc-800 text-cream text-xs rounded-none px-2 py-1 outline-none focus:border-gold'
                      onChange={(e) =>
                        handleRole(u.id, e.target.value as 'USER' | 'ADMIN')
                      }
                      value={u.role}
                    >
                      <option value='USER'>USER</option>
                      <option value='ADMIN'>ADMIN</option>
                    </select>
                  </td>
                  <td className='py-4 pr-3'>
                    <span
                      className={
                        'inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ' +
                        (u.status
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-barber-red/20 text-barber-red')
                      }
                    >
                      {u.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className='py-4 text-right'>
                    <Button
                      onClick={() => handleToggle(u.id)}
                      size='sm'
                      variant={u.status ? 'destructive' : 'default'}
                      className="h-8 text-[10px]"
                    >
                      {u.status ? 'Desativar' : 'Ativar'}
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  )
}

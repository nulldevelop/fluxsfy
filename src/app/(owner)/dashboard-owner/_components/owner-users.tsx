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
    <Card className='p-4'>
      <div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='font-semibold text-lg'>Controle de Usuários</h2>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <input
            className='w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 sm:w-72'
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Buscar por nome, email, plano...'
            value={query}
          />
        </div>
      </div>
      <Separator className='mb-3' />
      <ScrollArea className='h-[70vh] pr-2'>
        <table className='w-full border-collapse text-sm'>
          <thead className='sticky top-0 z-10 bg-white'>
            <tr className='text-left text-gray-600'>
              <th className='py-2 pr-3'>Nome</th>
              <th className='py-2 pr-3'>Email</th>
              <th className='py-2 pr-3'>Plano</th>
              <th className='py-2 pr-3'>Status Assinatura</th>
              <th className='py-2 pr-3'>Serviços</th>
              <th className='py-2 pr-3'>Agendamentos</th>
              <th className='py-2 pr-3'>Role</th>
              <th className='py-2 pr-3'>Ativo</th>
              <th className='py-2 pr-3'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              SKELETON_KEYS.map((key) => (
                <tr className='border-gray-100 border-b' key={key}>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-4 w-28' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-4 w-40' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-4 w-20' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-4 w-24' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-4 w-10' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-4 w-10' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-6 w-16 rounded-full' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-6 w-12 rounded-full' />
                  </td>
                  <td className='py-2 pr-3'>
                    <Skeleton className='h-8 w-20 rounded' />
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td className='py-8 text-center text-gray-500' colSpan={9}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((u, idx) => (
                <tr
                  className={
                    'border-gray-100 border-b ' +
                    (idx % 2 === 1 ? 'bg-gray-50/50' : '')
                  }
                  key={u.id}
                >
                  <td className='py-2 pr-3'>{u.name ?? '-'}</td>
                  <td className='py-2 pr-3'>{u.email}</td>
                  <td className='py-2 pr-3'>
                    <span className='rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 text-xs'>
                      {u.plan ?? '-'}
                    </span>
                  </td>
                  <td className='py-2 pr-3'>
                    <span
                      className={
                        'rounded-full px-2 py-0.5 font-medium text-xs ' +
                        (u.subscriptionStatus === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700')
                      }
                    >
                      {u.subscriptionStatus ?? '-'}
                    </span>
                  </td>
                  <td className='py-2 pr-3'>{u.servicesCount}</td>
                  <td className='py-2 pr-3'>{u.appointmentsCount}</td>
                  <td className='py-2 pr-3'>
                    <select
                      className='rounded-md border px-2 py-1'
                      onChange={(e) =>
                        handleRole(u.id, e.target.value as 'USER' | 'ADMIN')
                      }
                      value={u.role}
                    >
                      <option value='USER'>USER</option>
                      <option value='ADMIN'>ADMIN</option>
                    </select>
                  </td>
                  <td className='py-2 pr-3'>
                    <span
                      className={
                        'rounded-full px-2 py-0.5 font-medium text-xs ' +
                        (u.status
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700')
                      }
                    >
                      {u.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className='py-2 pr-3'>
                    <Button
                      onClick={() => handleToggle(u.id)}
                      size='sm'
                      variant='secondary'
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

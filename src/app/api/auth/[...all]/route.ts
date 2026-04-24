import { toNextJsHandler } from 'better-auth/next-js'
import { betterAuthInstance } from '@/lib/auth'

export const { POST, GET } = toNextJsHandler(betterAuthInstance)

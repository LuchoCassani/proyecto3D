import { vi, describe, it, expect } from 'vitest'

vi.mock('@/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    R2_ACCOUNT_ID: 'test-account',
    R2_ACCESS_KEY_ID: 'test-key',
    R2_SECRET_ACCESS_KEY: 'test-secret',
    R2_BUCKET_NAME: 'test-bucket',
  },
}))

const { createClient } = await import('./client')

describe('Supabase browser client', () => {
  it('se instancia sin lanzar excepciones', () => {
    expect(() => createClient()).not.toThrow()
  })
})

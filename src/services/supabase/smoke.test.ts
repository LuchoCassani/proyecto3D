import { vi, describe, it, expect } from 'vitest'

vi.mock('@/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    R2_ACCOUNT_ID: 'test-account',
    R2_ACCESS_KEY_ID: 'test-key',
    R2_SECRET_ACCESS_KEY: 'test-secret',
    R2_BUCKET_NAME: 'test-bucket',
  },
}))

describe('Supabase browser client', () => {
  it('se instancia sin lanzar excepciones', async () => {
    const { createClient } = await import('./client')
    expect(() => createClient()).not.toThrow()
  })
})

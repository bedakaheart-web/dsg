/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_METERED_DOMAIN?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  // add other VITE_ vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL?: string
  /** GetYourGuide Partner / Cookie ID for affiliate deep links */
  readonly VITE_GETYOURGUIDE_PARTNER_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

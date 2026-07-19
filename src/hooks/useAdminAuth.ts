import { useEffect, useState } from 'react'
import { isAdminAuthed, pb } from '../lib/ships'

/** Tracks PocketBase admin session for gating the Manage UI. */
export function useAdminAuth() {
  const [authed, setAuthed] = useState(() => isAdminAuthed())

  useEffect(() => {
    setAuthed(isAdminAuthed())
    return pb.authStore.onChange(() => {
      setAuthed(isAdminAuthed())
    })
  }, [])

  return authed
}

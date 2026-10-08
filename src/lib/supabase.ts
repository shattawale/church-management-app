import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { projectId, publicAnonKey } from "../../utils/supabase/info"

const globalWithSupabase = globalThis as typeof globalThis & {
  __gatherSupabaseClient?: SupabaseClient
}

export const supabase =
  globalWithSupabase.__gatherSupabaseClient ??
  createClient(`https://${projectId}.supabase.co`, publicAnonKey, {
    auth: {
      storageKey: `gather-${projectId}-auth`,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

globalWithSupabase.__gatherSupabaseClient = supabase

const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-9e34353d`

async function responsePayload(response: Response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {
      message: text.length > 240 ? `${text.slice(0, 240)}…` : text,
    }
  }
}

export async function signUpAccount(input: {
  email: string
  password: string
  fullName: string
  churchName: string
  branchId: string
}) {
  let response: Response
  try {
    response = await fetch(`${apiBase}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(input),
    })
  } catch {
    throw new Error(
      "The Supabase backend is unreachable. Deploy the Edge Function from Make settings, then try again.",
    )
  }
  const payload = await responsePayload(response)
  if (response.status === 404) {
    throw new Error(
      "The Supabase Edge Function is missing the required API routes. Redeploy the latest server from Make settings, then try again.",
    )
  }
  if (!response.ok) {
    throw new Error(
      payload.error ?? payload.message ?? "Unable to create account.",
    )
  }
  return payload
}

async function accessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error("Authentication required.")
  return session.access_token
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await accessToken()
  let response: Response
  try {
    response = await fetch(`${apiBase}/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
  } catch {
    throw new Error(
      "The Supabase backend is unreachable. Deploy the Edge Function from Make settings, then try again.",
    )
  }
  const payload = await responsePayload(response)
  if (response.status === 404) {
    throw new Error(
      "The Supabase Edge Function is missing the required API routes. Redeploy the latest server from Make settings, then try again.",
    )
  }
  if (!response.ok) {
    throw new Error(payload.error ?? payload.message ?? "Request failed.")
  }
  return payload.data as T
}

export const cloudStore = {
  list: <T>(resource: string) => apiRequest<T[]>(`/${resource}`),
  create: <T>(resource: string, value: unknown) =>
    apiRequest<T>(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(value),
    }),
  update: <T>(resource: string, id: string | number, value: unknown) =>
    apiRequest<T>(`/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(value),
    }),
  remove: (resource: string, id: string | number) =>
    apiRequest<void>(`/${resource}/${id}`, { method: "DELETE" }),
}

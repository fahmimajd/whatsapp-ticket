import http from './http'

export async function startWhatsApp() {
  const { data } = await http.post<{ ok: boolean; qr: string | null }>('whatsapp/start')
  return data
}

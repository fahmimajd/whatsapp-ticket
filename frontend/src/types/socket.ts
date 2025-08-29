export interface WaConnectionPayload {
  connection?: 'connecting' | 'open' | 'close'
  qr: string | null
}

export interface WaConnectionPayload {
  state: 'connecting' | 'qr' | 'open' | 'close' | 'error'
  qr?: string // bila backend kirim qr string
}

import http from './http'

export async function uploadAttachment(file: File) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await http.post('attachments', form)
  return data as { id: string; filename: string; mime: string }
}

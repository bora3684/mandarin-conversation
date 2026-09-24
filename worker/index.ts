type Env = { AI: Ai }

const expectedPhrases: Record<string, string> = {
  hello: '你好',
  'nice-to-meet-you': '很高兴认识你',
  'your-name': '你叫什么名字',
}

const supportedTypes = new Set(['audio/webm', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/mpeg'])
const maxAudioBytes = 2 * 1024 * 1024

function normalizeChinese(value: string) {
  return value.normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu, '')
}

async function transcribe(request: Request, env: Env) {
  const form = await request.formData().catch(() => null)
  const phraseId = form?.get('phraseId')
  const audio = form?.get('audio')

  if (typeof phraseId !== 'string' || !expectedPhrases[phraseId] || !(audio instanceof File)) {
    return Response.json({ error: 'Choose a phrase and add a recording.' }, { status: 400 })
  }
  const contentType = audio.type.split(';')[0]
  if (!supportedTypes.has(contentType) || audio.size === 0 || audio.size > maxAudioBytes) {
    return Response.json({ error: 'Record a short audio clip and try again.' }, { status: 400 })
  }

  try {
    const bytes = new Uint8Array(await audio.arrayBuffer())
    const base64 = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
    const result = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: base64,
      task: 'transcribe',
      language: 'zh',
      vad_filter: true,
      condition_on_previous_text: false,
    })
    const heard = result.text?.trim() || ''
    return Response.json({ heard, matchesPhrase: !!heard && normalizeChinese(heard) === expectedPhrases[phraseId] })
  } catch (error) {
    console.error('Transcription failed', error)
    return Response.json({ error: 'Transcription is unavailable right now. Please try again.' }, { status: 503 })
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return Response.json({ ok: true })
    }
    if (request.method === 'POST' && url.pathname === '/api/transcribe') {
      return transcribe(request, env)
    }
    if (url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler<Env>

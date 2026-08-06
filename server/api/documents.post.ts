import { embed } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabaseAdmin } from '../utils/supabase-admin'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const content = body?.content?.trim()

	if (!content || typeof content !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'content is required',
		})
	}

	const chunkSize = 500
	const chunks: string[] = []
	for (let i = 0; i < content.length; i += chunkSize) {
		chunks.push(content.slice(i, i + chunkSize))
	}

	const supabase = useServerSupabaseAdmin()
	let saved = 0

	for (const chunk of chunks) {
		const { embedding } = await embed({
			model: ollama.embedding('nomic-embed-text'),
			value: chunk,
		})

		const { error } = await supabase.from('documents').insert({
			content: chunk,
			embedding,
			metadata: { source: 'manual-upload' },
		})

		if (error) {
			throw createError({
				statusCode: 500,
				statusMessage: error.message,
			})
		}

		saved++
	}

	return {
		ok: true,
		saved,
	}
})
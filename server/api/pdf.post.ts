import { embed } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { PDFParse } from 'pdf-parse'
import { useServerSupabaseAdmin } from '../utils/supabase-admin'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event)
	const file = form?.find((item) => item.name === 'file')

	if (!file?.data) {
		throw createError({
			statusCode: 400,
			statusMessage: 'PDF file is required',
		})
	}

	// pdf-parse v2: class API, not default function export
	const parser = new PDFParse({ data: file.data })
	const parsed = await parser.getText()
	await parser.destroy()

	const text = parsed.text?.trim()

	if (!text) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No text found in PDF',
		})
	}

	const chunkSize = 500
	const chunks: string[] = []
	for (let i = 0; i < text.length; i += chunkSize) {
		chunks.push(text.slice(i, i + chunkSize))
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
			metadata: {
				source: 'pdf-upload',
				filename: file.filename || 'unknown.pdf',
			},
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
		pages: parsed.total,
	}
})

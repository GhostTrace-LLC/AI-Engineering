/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import {
	convertToModelMessages,
	embed,
	streamText,
	toUIMessageStream,
	type UIMessage,
} from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { SupabaseService } from '../supabase/supabase.service'

export interface DocumentMatch {
	id: string | number
	content: string
	metadata: Record<string, unknown> | null
	similarity: number
}

function isDocumentMatch(value: unknown): value is DocumentMatch {
	if (typeof value !== 'object' || value === null) {
		return false
	}

	const row = value as Record<string, unknown>
	return (
		(typeof row.id === 'string' || typeof row.id === 'number') &&
		typeof row.content === 'string' &&
		typeof row.similarity === 'number' &&
		(row.metadata === null ||
			row.metadata === undefined ||
			(typeof row.metadata === 'object' && !Array.isArray(row.metadata)))
	)
}

@Injectable()
export class RagService {
	private ollama = createOllama({
		baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/api',
	})

	constructor(private readonly supabase: SupabaseService) { }

	async addTextDocument(content: string) {
		const text = (content ?? '').trim()
		if (!text) {
			throw new BadRequestException('content is required')
		}

		const chunkSize = 500
		const chunks: string[] = []
		for (let i = 0; i < text.length; i += chunkSize) {
			chunks.push(text.slice(i, i + chunkSize))
		}

		let saved = 0

		for (const chunk of chunks) {
			const { embedding } = await embed({
				model: this.ollama.embedding('nomic-embed-text'),
				value: chunk,
			})

			const { error } = await this.supabase.admin.from('documents').insert({
				content: chunk,
				embedding,
				metadata: { source: 'nestjs-manual-upload' },
			})

			if (error) {
				throw new InternalServerErrorException(error.message)
			}
			saved++
		}

		return { ok: true, saved }
	}

	async search(query: string) {
		const text = (query ?? '').trim()
		if (!text) {
			throw new BadRequestException('query is required')
		}

		const { embedding } = await embed({
			model: this.ollama.embedding('nomic-embed-text'),
			value: text,
		})

		const matches = await this.matchDocuments(embedding, 5)

		return { ok: true, matches }
	}

	async chat(messages: UIMessage[]) {
		const lastUserMessage = [...messages]
			.reverse()
			.find((m) => m.role === 'user')

		const question = lastUserMessage
			? lastUserMessage.parts
				.filter(
					(part): part is { type: 'text'; text: string } =>
						part.type === 'text' && typeof part.text === 'string',
				)
				.map((part) => part.text)
				.join(' ')
				.trim()
			: ''

		if (!question) {
			throw new BadRequestException('No user question found')
		}

		const { embedding } = await embed({
			model: this.ollama.embedding('nomic-embed-text'),
			value: question,
		})

		const matches = await this.matchDocuments(embedding, 3)

		const strongMatches = matches.filter((m) => m.similarity >= 0.55)

		const context =
			strongMatches.length > 0
				? strongMatches.map((m) => m.content).join('\n\n')
				: 'هیچ سند مرتبطی پیدا نشد.'

		const result = streamText({
			model: this.ollama('gemma2:2b'),
			system: `تو یک دستیار فارسی‌زبان هستی.
فقط اگر اطلاعات زیر مستقیماً به سؤال مربوط است از آن‌ها استفاده کن.
اگر سؤال احوال‌پرسی یا نامرتبط است، کوتاه پاسخ بده و از اطلاعات اسناد استفاده نکن.
اگر جواب در اطلاعات نبود بگو: «در اسناد موجود پیدا نکردم.»

اطلاعات:
${context}`,
			messages: await convertToModelMessages(messages),
			temperature: 0.3,
		})

		return toUIMessageStream({ stream: result.stream })
	}

	private async matchDocuments(
		embedding: number[],
		matchCount: number,
	): Promise<DocumentMatch[]> {
		const result = await this.supabase.anon.rpc('match_documents', {
			query_embedding: embedding,
			match_threshold: 0.55,
			match_count: matchCount,
		})

		if (result.error) {
			throw new InternalServerErrorException(result.error.message)
		}

		const rows: unknown[] = Array.isArray(result.data)
			? (result.data as unknown[])
			: []

		return rows.filter(isDocumentMatch)
	}
}
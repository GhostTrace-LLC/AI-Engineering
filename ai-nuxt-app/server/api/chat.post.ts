import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
});

export default defineEventHandler(async (event) => {
	const { messages }: { messages: UIMessage[] } = await readBody(event);

	const result = streamText({
		model: ollama('gemma2:2b'),
		messages: await convertToModelMessages(messages),
		temperature: 0.7,
	});

	return result.toUIMessageStreamResponse();
});

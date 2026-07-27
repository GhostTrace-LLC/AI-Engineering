<template>
	<div class="flex w-full max-w-2xl flex-col gap-4">
		<!-- Header -->
		<div
			class="flex flex-col gap-3 rounded-2xl border border-default bg-default p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
			<div class="text-start">
				<h1 class="text-lg font-semibold text-highlighted">چت با هوش مصنوعی</h1>
				<p class="mt-0.5 text-sm text-muted">پیام بفرستید و پاسخ استریم‌شده بگیرید</p>
			</div>
			<USelect v-model="selectedApi" :items="apiOptions" value-key="value" class="w-full sm:w-48"
				:disabled="loading" />
		</div>

		<!-- Chat panel -->
		<div
			class="flex h-[min(70vh,40rem)] flex-col overflow-hidden rounded-2xl border border-default bg-default shadow-sm">
			<div class="min-h-0 flex-1 overflow-y-auto">

				<div v-if="!messages.length"
					class="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted">
					<UIcon name="i-lucide-message-circle" class="size-10 opacity-50" />
					<p class="text-sm">هنوز پیامی نیست. یک سوال بپرسید.</p>
				</div>

			<UChatMessages v-else :messages="messages" :status="status" :should-auto-scroll="true" class="p-4"
					:user="{ side: 'right', variant: 'soft', avatar: { icon: 'i-lucide-user' } }"
					:assistant="{ side: 'left', variant: 'naked', avatar: { icon: 'i-lucide-bot' } }" />
			</div>

			<UChatPrompt v-model="input" placeholder="پیام خود را بنویسید…" :error="error"
				class="border-t border-default" @submit="onSubmit">
			<UChatPromptSubmit :status="status" @stop="stop()" @reload="regenerate()" />
			</UChatPrompt>
		</div>
	</div>
</template>

<script setup>

import { useChat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const input = ref('')
const selectedApi = ref('/api/chat')

const apiOptions = [
	{ label: 'Ollama (محلی)', value: '/api/chat', icon: 'i-lucide-server' },
	{ label: 'Grok (xAI)', value: '/api/chat-grok', icon: 'i-lucide-sparkles' },
]

const { messages, sendMessage, status, error, stop, regenerate } = useChat(() => ({
	transport: new DefaultChatTransport({ api: selectedApi.value }),
}))

const loading = computed(() => status.value === 'submitted' || status.value === 'streaming')

function onSubmit() {
	const text = input.value.trim()
	if (!text || loading.value) return
	input.value = ''
	sendMessage({ text })
}

</script>
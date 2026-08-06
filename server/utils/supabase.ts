import { createClient } from '@supabase/supabase-js'

export function useServerSupabase() {
	const config = useRuntimeConfig()

	const url = config.supabaseUrl
	const key = config.supabaseAnonKey

	if (!url || !key) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Supabase env is missing',
		})
	}

	return createClient(url, key)
}
import { createClient } from '@supabase/supabase-js'

export function useServerSupabaseAdmin() {
	const config = useRuntimeConfig()

	if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Missing Supabase service role config',
		})
	}

	return createClient(
		config.supabaseUrl,
		config.supabaseServiceRoleKey
	)
}
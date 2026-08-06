import { useServerSupabase } from '../utils/supabase'

export default defineEventHandler(async () => {
	const supabase = useServerSupabase()

	const { data, error } = await supabase
		.from('documents')
		.select('id, content')
		.limit(5)

	if (error) {
		return {
			ok: false,
			message: error.message,
		}
	}

	return {
		ok: true,
		rows: data,
	}
})
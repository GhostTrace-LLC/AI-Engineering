/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
	readonly anon: SupabaseClient<any, 'public', 'public', any, any>;
	readonly admin: SupabaseClient<any, 'public', 'public', any, any>;

	constructor(private readonly config: ConfigService) {
		const url = this.config.get<string>('SUPABASE_URL');
		const anonKey = this.config.get<string>('SUPABASE_ANON_KEY');
		const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

		if (!url || !anonKey || !serviceKey) {
			throw new Error('Missing Supabase env variables');
		}

		this.anon = createClient<any, 'public', 'public'>(url, anonKey);
		this.admin = createClient<any, 'public', 'public'>(url, serviceKey);
	}
}

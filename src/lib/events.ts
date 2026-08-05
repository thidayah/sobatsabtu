import { supabaseServer } from '@/lib/supabase';
import { checkUUID } from '@/lib/utils';

export async function getAllEvents() {
  const { data: events, error } = await supabaseServer
    .from('ss_events')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return events ?? [];
}

export async function getHomepageEvents(limit = 8) {
  const { data: events, error } = await supabaseServer
    .from('ss_events')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return events ?? [];
}

export async function getEventByIdentifier(identifier: string) {
  const isUUID = checkUUID(identifier);

  let query = supabaseServer.from('ss_events').select('*');
  query = isUUID ? query.eq('id', identifier) : query.eq('slug', identifier);

  const { data: event, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return event;
}

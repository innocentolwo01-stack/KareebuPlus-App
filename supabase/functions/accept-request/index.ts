// supabase/functions/accept-request/index.ts
//
// A driver claims an offered request. The atomic part: the UPDATE below
// only matches a row that's still unclaimed (driver_id is null). If two
// drivers hit this within milliseconds of each other, only the first
// one's WHERE clause still matches by the time it actually runs — the
// second gets back zero rows, not an error and not a partial assignment.
//
// Deploy: supabase functions deploy accept-request

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 })
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 })
    }

    const { request_id } = await req.json()
    if (!request_id) {
      return new Response(JSON.stringify({ error: 'request_id is required' }), { status: 400 })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey)

    const { data: updated, error: updateError } = await admin
      .from('requests')
      .update({
        driver_id: user.id,
        status: 'matched',
        updated_at: new Date().toISOString(),
      })
      .eq('id', request_id)
      .is('driver_id', null)
      .in('status', ['requested', 'ready'])
      .select()
      .maybeSingle()

    if (updateError) throw updateError

    if (!updated) {
      return new Response(
        JSON.stringify({
          error: 'already_taken',
          message: 'This request was already claimed or is no longer available',
        }),
        { status: 409 },
      )
    }

    await admin
      .from('drivers')
      .update({ availability: 'busy', updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return new Response(JSON.stringify({ request: updated }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Unexpected error accepting request' }), { status: 500 })
  }
})

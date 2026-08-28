// supabase/functions/dispatch-request/index.ts
//
// Finds nearby available drivers for a request, expanding the search
// radius in steps if nothing turns up. Called immediately after
// create-request for rides, and from mark-order-ready for commerce
// orders. Depends on the find_nearby_drivers() function in schema.sql.
//
// Deploy: supabase functions deploy dispatch-request

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const RADIUS_STEPS_METERS = [3000, 5000, 8000]

Deno.serve(async (req) => {
  try {
    const { request_id } = await req.json()
    if (!request_id) {
      return new Response(JSON.stringify({ error: 'request_id is required' }), { status: 400 })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey)

    const { data: request, error: reqError } = await admin
      .from('requests')
      .select('*, service_types(allowed_vehicle_types), merchants(location)')
      .eq('id', request_id)
      .single()
    if (reqError || !request) {
      return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 })
    }

    // Search center: the merchant's location for commerce orders (the
    // driver picks up there first), the customer's origin for rides.
    const searchPoint = request.merchants?.location ?? request.origin
    if (!searchPoint) {
      return new Response(JSON.stringify({ error: 'No location to search from' }), { status: 400 })
    }

    let candidates: { id: string; distance_meters: number }[] = []
    for (const radius of RADIUS_STEPS_METERS) {
      const { data, error } = await admin.rpc('find_nearby_drivers', {
        search_point: searchPoint,
        allowed_types: request.service_types.allowed_vehicle_types,
        radius_meters: radius,
      })
      if (error) throw error
      if (data && data.length > 0) {
        candidates = data
        break
      }
    }

    if (candidates.length === 0) {
      return new Response(JSON.stringify({ dispatched: false, reason: 'no_drivers_in_range' }), { status: 200 })
    }

    // TODO: send a push notification (FCM) to each candidate so their app
    // surfaces the offer immediately, rather than relying on them having
    // the app open. For now, candidates also see it via a Realtime
    // subscription on `requests` — accept-request's atomic update is what
    // actually decides who gets it, regardless of how they found out.

    return new Response(
      JSON.stringify({ dispatched: true, candidate_count: candidates.length }),
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Unexpected error dispatching request' }), { status: 500 })
  }
})

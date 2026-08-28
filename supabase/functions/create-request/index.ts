// supabase/functions/create-request/index.ts
//
// Creates a request (ride or commerce order). Verifies the customer's
// payment reference before writing anything, then inserts the request
// (+ items, for commerce types) and a `held` payment row.
//
// Deploy: supabase functions deploy create-request

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

    // Client scoped to the calling user, so we know who's actually asking.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 })
    }

    const body = await req.json()
    const { service_type_id, merchant_id, origin, destination, items, payment_reference } = body

    if (!destination) {
      return new Response(JSON.stringify({ error: 'destination is required' }), { status: 400 })
    }
    if (!payment_reference) {
      return new Response(JSON.stringify({ error: 'payment_reference is required' }), { status: 400 })
    }

    // Service-role client for the privileged reads/writes below.
    const admin = createClient(supabaseUrl, serviceRoleKey)

    const { data: serviceType, error: stError } = await admin
      .from('service_types')
      .select('*')
      .eq('id', service_type_id)
      .single()
    if (stError || !serviceType) {
      return new Response(JSON.stringify({ error: 'Unknown service_type_id' }), { status: 400 })
    }
    if (serviceType.needs_merchant && !merchant_id) {
      return new Response(JSON.stringify({ error: 'merchant_id is required for this service type' }), { status: 400 })
    }
    if (serviceType.needs_items && (!items || items.length === 0)) {
      return new Response(JSON.stringify({ error: 'items are required for this service type' }), { status: 400 })
    }

    // --- Payment verification -------------------------------------------
    // TODO: replace with a real call to Flutterwave's transaction-verify
    // endpoint (using FLUTTERWAVE_SECRET_KEY as an env var), and confirm
    // both status and amount match what's expected before trusting it.
    // Stubbed as `true` here so the rest of the flow can be wired and
    // tested end-to-end before payments are fully hooked up.
    const paymentVerified = true
    const totalAmount = 0 // TODO: sum(items × product price) for commerce, or a fare estimate for rides
    if (!paymentVerified) {
      return new Response(JSON.stringify({ error: 'Payment could not be verified' }), { status: 402 })
    }
    // ----------------------------------------------------------------------

    const { data: request, error: reqError } = await admin
      .from('requests')
      .insert({
        customer_id: user.id,
        service_type_id,
        merchant_id: merchant_id ?? null,
        status: 'requested',
        origin: origin ?? null,
        destination,
        price: totalAmount,
      })
      .select()
      .single()
    if (reqError) throw reqError

    if (serviceType.needs_items && items?.length) {
      const rows = items.map((i: { product_id: string; quantity: number }) => ({
        request_id: request.id,
        product_id: i.product_id,
        quantity: i.quantity,
      }))
      const { error: itemsError } = await admin.from('request_items').insert(rows)
      if (itemsError) throw itemsError
    }

    await admin.from('payments').insert({
      request_id: request.id,
      total: totalAmount,
      status: 'held',
    })

    // The merchant's print-bridge device picks this up via a Realtime
    // subscription on `requests` filtered by merchant_id — no explicit
    // print call needed from here.

    if (serviceType.dispatch_trigger === 'immediate') {
      // TODO: invoke the dispatch function once it exists, e.g.
      // await admin.functions.invoke('dispatch-request', { body: { request_id: request.id } })
    }

    return new Response(JSON.stringify({ request }), { status: 201 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Unexpected error creating request' }), { status: 500 })
  }
})

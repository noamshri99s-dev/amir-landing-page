import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

const WELCOME_MESSAGE = `AVIVI Diamonds
ברוכים הבאים למעגל הלקוחות שלנו! 💎
צרפת בהצלחה למעגל הלקוחות המיוחד שלנו ותקבל/י הודעות על מבצעים, הנחות מיוחדות והנחה של 20% ביום ההולדת שלך!
נשמח לראות אותך אצלנו ✨
https://avivi.co.il`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request')
    return new Response('ok', { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      }
    })
  }

  console.log('📥 Edge Function called:', {
    method: req.method,
    url: req.url,
  })

  try {
    let body
    try {
      body = await req.json()
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('📥 Request body:', body)
    const { phone } = body

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔑 Twilio config check:', {
      hasAccountSid: !!TWILIO_ACCOUNT_SID,
      hasAuthToken: !!TWILIO_AUTH_TOKEN,
      hasPhoneNumber: !!TWILIO_PHONE_NUMBER
    })

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.error('❌ Twilio not configured')
      return new Response(
        JSON.stringify({ error: 'Twilio not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Format Israeli phone number
    let formattedPhone = phone
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+972' + formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+972' + formattedPhone
    }

    console.log('📱 Formatted phone:', { original: phone, formatted: formattedPhone })

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    const formData = new URLSearchParams()
    formData.append('From', TWILIO_PHONE_NUMBER)
    formData.append('To', formattedPhone)
    formData.append('Body', WELCOME_MESSAGE)

    console.log('📤 Sending SMS to Twilio:', { url: twilioUrl, to: formattedPhone, from: TWILIO_PHONE_NUMBER })

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const result = await response.json()
    console.log('📥 Twilio response:', { status: response.status, result })

    if (response.ok) {
      console.log('✅ SMS sent successfully:', result.sid)
      return new Response(
        JSON.stringify({ success: true, sid: result.sid }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.error('❌ Twilio error:', result)
      return new Response(
        JSON.stringify({ error: result.message || 'Failed to send SMS' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

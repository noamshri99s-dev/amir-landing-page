# הגדרת שליחת SMS דרך Supabase Edge Functions

## שלב 1: יצירת Edge Function

1. התקן את Supabase CLI (אם עדיין לא):
```bash
npm install -g supabase
```

2. התחבר ל-Supabase:
```bash
supabase login
```

3. קשר את הפרויקט:
```bash
supabase link --project-ref your-project-ref
```

## שלב 2: יצירת Edge Function

1. צור Edge Function חדשה:
```bash
supabase functions new send-welcome-sms
```

2. הוסף את הקוד הבא ל-`supabase/functions/send-welcome-sms/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

const WELCOME_MESSAGE = `AVIVI Diamonds
ברוכים הבאים למעגל הלקוחות שלנו! 💎
צרפת בהצלחה למעגל הלקוחות המיוחד שלנו ותקבל/י הודעות על מבצעים, הנחות מיוחדות והנחה של 20% ביום ההולדת שלך!
נשמח לראות אותך אצלנו ✨
https://avivi.co.il`

serve(async (req) => {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return new Response(
        JSON.stringify({ error: 'Twilio not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Format Israeli phone number
    let formattedPhone = phone
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+972' + formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+972' + formattedPhone
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    const formData = new URLSearchParams()
    formData.append('From', TWILIO_PHONE_NUMBER)
    formData.append('To', formattedPhone)
    formData.append('Body', WELCOME_MESSAGE)

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const result = await response.json()

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, sid: result.sid }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ error: result.message || 'Failed to send SMS' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

## שלב 3: הגדרת משתני סביבה

1. לך ל-Supabase Dashboard → Edge Functions → Settings
2. הוסף את המשתנים הבאים:
   - `TWILIO_ACCOUNT_SID` - ה-Account SID מ-Twilio
   - `TWILIO_AUTH_TOKEN` - ה-Auth Token מ-Twilio
   - `TWILIO_PHONE_NUMBER` - המספר שקנית מ-Twilio (בפורמט +1... או +972...)

## שלב 4: Deploy של ה-Function

```bash
supabase functions deploy send-welcome-sms
```

## שלב 5: עדכון הקוד בפרונטאנד

אחרי שיצרת את ה-Edge Function, עדכן את הקוד ב-`LeadForm.tsx` ו-`BirthdayPopup.tsx` לקרוא ל-Function הזו במקום ל-backend API.

## חלופה: Database Trigger

אפשר גם ליצור Database Trigger ב-Supabase שיקרא ל-Edge Function אוטומטית כשיש רשומה חדשה ב-`birthday_leads`.

SQL ליצירת Trigger:
```sql
-- יצירת פונקציה שתקרא ל-Edge Function
CREATE OR REPLACE FUNCTION send_welcome_sms()
RETURNS TRIGGER AS $$
BEGIN
  -- קריאה ל-Edge Function
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/send-welcome-sms',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object('phone', NEW.phone)
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- יצירת Trigger
CREATE TRIGGER on_new_birthday_lead
AFTER INSERT ON birthday_leads
FOR EACH ROW
EXECUTE FUNCTION send_welcome_sms();
```

**הערה:** זה דורש הרשאות מתאימות ב-Supabase.

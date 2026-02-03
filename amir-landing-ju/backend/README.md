# Backend API

זהו ה-backend API עבור מערכת ניהול הלידים, תאריכי הלידה ושליחת SMS.

## התקנה

1. התקן את התלויות:
```bash
cd backend
npm install
```

2. צור קובץ `.env` והגדר את המשתנים הבאים:
```env
# Server
PORT=5001

# Supabase (חובה)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio SMS (אופציונלי - לשליחת SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## הרצה

```bash
npm start
```

או למצב פיתוח עם auto-reload:
```bash
npm run dev
```

השרת ירוץ על http://localhost:5001

## API Endpoints

### Public Endpoints

- `GET /api/health` - בדיקת תקינות השרת
- `POST /api/leads` - שמירת ליד חדש מטופס הלידים
- `POST /api/birthday-leads` - שמירת תאריך לידה מטופס יום ההולדת

### SMS Management Endpoints

- `GET /api/admin/todays-birthdays` - קבלת רשימת ימי הולדת להיום
- `GET /api/admin/birthdays-by-date?month=MM&day=DD` - קבלת ימי הולדת לפי תאריך
- `POST /api/admin/send-birthday-sms` - שליחת SMS יום הולדת לאדם ספציפי
  - Body: `{ phone: string, gender: string }`
- `POST /api/admin/send-sms` - שליחת SMS מותאם אישית
  - Body: `{ phone: string, message: string }`
- `POST /api/admin/send-all-birthday-sms` - שליחת SMS לכל חוגגי היום הולדת היום
- `GET /api/admin/sms-log` - קבלת לוג הודעות SMS (100 אחרונות)

## Database

המערכת משתמשת ב-**Supabase** לאחסון נתונים.

### טבלאות נדרשות:

1. **leads** - לידים
   - `id` (bigint, primary key)
   - `name` (text)
   - `phone` (text)
   - `interest` (text)
   - `created_at` (timestamptz)

2. **birthday_leads** - תאריכי לידה
   - `id` (bigint, primary key)
   - `phone` (text, unique)
   - `birthday` (date)
   - `gender` (text)
   - `created_at` (timestamptz)

3. **sms_log** - לוג הודעות SMS
   - `id` (bigint, primary key)
   - `phone` (text)
   - `message` (text)
   - `success` (boolean)
   - `error_message` (text)
   - `sent_at` (timestamptz)

## SMS עם Twilio

כדי להפעיל שליחת SMS:

1. הרשם ל-Twilio בכתובת: https://www.twilio.com
2. קבל Account SID, Auth Token ומספר טלפון
3. הזן את הפרטים בקובץ `.env`

### הודעות יום הולדת אוטומטיות

המערכת תשלח **אוטומטית** כל יום בשעה **9:00 בבוקר** הודעות SMS לכל מי שיש לו יום הולדת באותו יום.

**תוכן ההודעה:**
- הנחה של **20%** עם קוד: `BIRTHDAY20`
- בתוקף ל-7 ימים
- הודעות מותאמות למגדר (גבר/אישה)

### שליחה ידנית

אפשר גם לשלוח הודעות ידנית דרך מסך האדמין:
- שליחה לכל חוגגי יום הולדת היום
- שליחה לאדם ספציפי
- שליחת הודעה מותאמת אישית לכל מספר


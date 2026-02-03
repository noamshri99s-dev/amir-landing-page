# הגדרת Supabase Database

## שלב 1: יצירת הטבלאות

1. לך ל-Supabase Dashboard → SQL Editor
2. הרץ את ה-SQL הבא:

```sql
-- טבלת לידים
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  interest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת תאריכי לידה
CREATE TABLE IF NOT EXISTS birthday_leads (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  birthday DATE NOT NULL,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- יצירת אינדקסים
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_birthday_leads_phone ON birthday_leads(phone);
CREATE INDEX IF NOT EXISTS idx_birthday_leads_birthday ON birthday_leads(birthday);

-- הגדרת Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_leads ENABLE ROW LEVEL SECURITY;

-- מדיניות: כל אחד יכול להוסיף (INSERT)
CREATE POLICY "Allow public insert on leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on birthday_leads" ON birthday_leads
  FOR INSERT WITH CHECK (true);

-- מדיניות: רק משתמשים מחוברים יכולים לקרוא (SELECT)
CREATE POLICY "Allow authenticated read on leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on birthday_leads" ON birthday_leads
  FOR SELECT USING (auth.role() = 'authenticated');
```

## שלב 2: יצירת משתמש אדמין

1. לך ל-Authentication → Users
2. לחץ "Add user" → "Create new user"
3. הזן:
   - Email: המייל שלך
   - Password: הסיסמה שלך
   - Auto Confirm User: הפעל
4. לחץ "Create user"

## שלב 3: הגדרת משתני סביבה

**חשוב:** צריך להשתמש ב-**anon public** key, לא ב-service role key!

1. לך ל-Supabase Dashboard → Settings → API
2. תחת "Project API keys" → "anon" "public" - העתק את המפתח הזה
3. זה אמור להתחיל ב-`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (לא `sb_secret_`)

בקובץ `.env.local`:
```
VITE_SUPABASE_URL=https://yzrxezfaparwcfwgwpqz.supabase.co
VITE_SUPABASE_ANON_KEY=הדבק כאן את ה-anon public key (לא service role!)



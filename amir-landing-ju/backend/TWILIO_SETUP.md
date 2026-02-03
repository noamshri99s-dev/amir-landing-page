# הוראות הגדרת Twilio

## שלב 1: קבלת Account SID ו-Auth Token

1. היכנס ל-https://console.twilio.com
2. בדשבורד הראשי (Account Dashboard) תראה:
   - **Account SID** - מופיע ישירות (משהו כמו `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** - לחץ על העין (👁️) כדי להציג אותו

## שלב 2: קבלת מספר טלפון

### אופציה A: מספר ניסיון (Trial - חינם)
1. בתפריט השמאלי, תחת **"Messaging"**
2. לחץ על **"Try it out"**
3. שם תראה את המספר שלך (משהו כמו `+15005550006`)
4. **חשוב:** מספר ניסיון יכול לשלוח רק למספרים שאושרו ב-Twilio!

### אופציה B: קניית מספר אמיתי (מומלץ לייצור)
1. בתפריט השמאלי, תחת **"Phone Numbers"**
2. לחץ על **"Buy a number"**
3. בחר מדינה (ישראל - Israel)
4. בחר מספר
5. אישור תשלום

## שלב 3: הוספה לקובץ .env

פתח את הקובץ `backend/.env` והוסף:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+972501234567
```

**חשוב:**
- החלף את הערכים בערכים האמיתיים שלך
- המספר צריך להיות בפורמט בינלאומי עם `+` (למשל: `+972501234567`)

## שלב 4: הרצת השרת

```bash
cd backend
npm start
```

השרת יבדוק אם Twilio מוגדר ויציג הודעה:
- ✅ `Twilio configured` - אם הכל תקין
- ⚠️ `Twilio not configured` - אם חסרים פרטים

## בדיקה

1. היכנס למסך האדמין: `http://localhost:5173/admin`
2. לחץ על הטאב **"שליחת SMS"**
3. נסה לשלוח הודעה מותאמת אישית למספר שלך
4. בדוק את הטאב **"היסטוריית הודעות"** כדי לראות אם נשלח

## פתרון בעיות

### שגיאת הרשאות ב-"Services"
- **לא צריך** את ה-"Services" לשליחת SMS פשוטים
- השתמש ב-"Try it out" או "Phone Numbers" במקום

### מספר ניסיון לא שולח
- מספרי ניסיון יכולים לשלוח רק למספרים שאושרו ב-Twilio
- עבור ל-"Phone Numbers" → "Verified Caller IDs" והוסף את המספר שלך
- או קנה מספר אמיתי

### שגיאת "Invalid phone number"
- ודא שהמספר בפורמט בינלאומי: `+972501234567`
- לא `0501234567` או `972501234567` (חסר `+`)

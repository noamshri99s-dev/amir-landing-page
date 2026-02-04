# מדריך העלאה ל-GitHub (בלי לשנות את האתר)

## 1. אבחון – למה ההעלאה נכשלת

| סיבה | איך לבדוק | מגבלת GitHub |
|------|-----------|---------------|
| קובץ בודד מעל 100MB | `find . -type f -size +100M` | קובץ מקסימלי **100MB** |
| repo כבד (היסטוריה) | `du -sh .git` | מומלץ עד ~1GB |
| node_modules / dist ב־git | `git ls-files \| grep node_modules` | לא להעלות |
| סוד ב־commit (מפתח/סיסמה) | GitHub חוסם push | להסיר או לאשר ידנית |

---

## 2. פתרונות לפי מצב (בלי לשנות UI)

### מצב A: יש קבצים גדולים מדי (>100MB)

**מה לעשות:** לא להעלות את הקובץ ל־git (או להשתמש ב־Git LFS).

```bash
# בדיקה – אילו קבצים מעל 100MB
find . -type f -size +100M -not -path './.git/*'

# אם זה node_modules – וודא שהם ב-.gitignore (ראה למטה)
# אם זו תמונה – העבר ל-Git LFS או שמור בחוץ (CDN) והשאר קישור
```

**אם חייבים את הקובץ ב-repo:** Git LFS (ראה סעיף 4).

---

### מצב B: יותר מדי קבצים / repo כבד (בלי להסיר תמונות מהאתר)

**מה לעשות:** לוודא שרק קוד + תמונות האתר ב־git. לא node_modules, לא build.

```bash
# מה הכי תופס מקום
du -sh * .* 2>/dev/null | sort -rh | head -15

# וודא ש-.gitignore חוסם את התיקיות הכבדות
cat .gitignore
```

**תמונות האתר (public/images):** נשארות. רק מונעים כפילויות (cache, dist, node_modules).

---

### מצב C: כבר עשית commit לקבצים גדולים – ניקוי היסטוריה

**מה לעשות:** היסטוריה חדשה עם commit אחד “נקי”.

```bash
cd "/Users/macbook/Documents/dev/דפי נחיתה לקוחות/amir_landing page"

# 1. שמור את המצב הנוכחי (כל הקבצים שאתה רוצה)
git add -A
git status   # וודא שאין node_modules/dist

# 2. ענף חדש בלי היסטוריה
git checkout --orphan clean-main

# 3. commit יחיד
git add -A
git commit -m "Initial commit: clean repo"

# 4. החלף את main
git branch -D main
git branch -m main

# 5. דחיפה (מחליף את מה שיש ב-GitHub)
git push -u origin main --force
```

**אזהרה:** `--force` מוחק את ה־main ב-GitHub ומחליף בהיסטוריה החדשה. השתמש רק אם זה ה-repo הנכון.

---

## 3. צעדים מדויקים ב-Terminal

### שלב 1: .gitignore נכון (ב-root הפרויקט)

```bash
cd "/Users/macbook/Documents/dev/דפי נחיתה לקוחות/amir_landing page"
```

וודא שבקובץ `.gitignore` (בתיקיית השורש) יש:

```
# Dependencies & build
node_modules
.pnp
.pnp.js

# Build outputs
dist
dist-ssr
build
.next
out
*.tsbuildinfo

# Cache
.cache
.parcel-cache
.vite
*.local

# Env (סודות – לא להעלות)
.env
.env.local
.env.*.local

# OS & IDE
.DS_Store
*.log
.vscode/*
!.vscode/extensions.json
.idea

# Optional – קבצי עזר להעלאה
upload-*.json
mcp-args-*.json
push-batch-*.json
api-batch.json
upload-to-github.mjs
```

(אם יש לך כבר חלק מזה – פשוט תשלים את מה שחסר.)

### שלב 2: בדיקה מה כבד

```bash
# קבצים מעל 50MB (GitHub: עד 100MB לקובץ)
find . -type f -size +50M -not -path './.git/*'

# גודל תיקיות
du -sh * .* 2>/dev/null | sort -rh | head -15

# האם node_modules/dist ב-git (אמור להיות 0 שורות)
git ls-files | grep -E 'node_modules|dist|\.next'
```

### שלב 3: העלאה מחדש נקייה (אם מתחילים מ־git נקי)

```bash
cd "/Users/macbook/Documents/dev/דפי נחיתה לקוחות/amir_landing page"

# אם יש כבר .git ורוצים “התחלה נקייה” (זהירות – מוחק היסטוריה מקומית)
git checkout --orphan temp-main
git add -A
git reset -- upload-*.json mcp-*.json push-*.json api-batch.json 2>/dev/null
git status
git commit -m "Initial commit: Amir landing page"
git branch -D main
git branch -m main
git push -u origin main --force
```

(התאמת שם ה־remote אם אצלך הוא לא `origin`.)

---

## 4. שמירה על אותן תמונות (בלי לשנות את האתר)

- **אין קובץ מעל 100MB:**  
  לא צריך Git LFS. פשוט להשאיר את כל התמונות ב־`public/images` כמו היום – האתר נשאר זהה.

- **יש תמונה/קובץ מעל 100MB:**  
  **Git LFS** – שומר את הקובץ “במקום אחר” ב-GitHub, ב-git נשאר רק pointer. האתר לא משתנה, רק איך הקובץ מאוחסן ב-repo.

```bash
# התקנה (פעם אחת)
brew install git-lfs
git lfs install

# מעקב אחרי סוגי קבצים (לפני ה-commit הראשון עם התמונות)
git lfs track "*.png"
git lfs track "*.jpg"
git lfs track "*.jpeg"
git add .gitattributes
```

**חסרונות LFS:** צריך `git lfs install` אצל כל מפתח; ב-GitHub יש מגבלות לפי תוכנית.

**אלטרנטיבה:** לשמור תמונות ענק ב־CDN/Storage ורק קישור ב־קוד – האתר נשאר אותו דבר, רק מקור התמונה משתנה.

---

## 5. Checklist – הכול מוכן להעלאה

- [ ] **.gitignore** – כולל `node_modules`, `dist`, `build`, `.next`, `.env`, `.env.local`
- [ ] **אין קבצים >100MB** – `find . -type f -size +100M` מחזיר ריק (מחוץ ל-.git)
- [ ] **node_modules לא ב-git** – `git ls-files | grep node_modules` מחזיר ריק
- [ ] **dist/build לא ב-git** – `git ls-files | grep -E 'dist|\.next'` מחזיר ריק
- [ ] **אין סודות ב-commits** – `.env` לא ב-git, ב-.env.example רק placeholders
- [ ] **Remote מוגדר** – `git remote -v` מציג את ה-URL של GitHub
- [ ] **Push** – `git push -u origin main` (או `--force` אחרי ניקוי היסטוריה לפי מצב C)

---

**סיכום:**  
בפרויקט הנוכחי כל הקבצים המעקבים קטנים מ־1MB ו־node_modules לא ב-git. אם עדיין יש כשל, סביר שמדובר ב-**סוד שזוהה ב-commit** (למשל מפתח ב-.env.example בעבר) – אז או מנקים היסטוריה (מצב C) או משתמשים ב־Unblock secret ב-GitHub. ביצוע ה-Checklist למעלה אמור להביא להעלאה מוצלחת בלי לשנות את האתר.

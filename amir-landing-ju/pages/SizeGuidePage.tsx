import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import { usePageEffects } from '../hooks/usePageEffects';

export default function SizeGuidePage() {
  // Use the optimized shared hook for parallax and reveal effects
  usePageEffects();

  return (
    <div className="min-h-screen bg-[#e0d7d3] text-[#16382b] selection:bg-[#16382b] selection:text-[#e0d7d3]">
      <Header />
      
      <main className="relative pt-32">
        {/* Living background layers */}
        <div className="bg-motion" aria-hidden="true">
          <div className="bg-layer bg-gradient"></div>
          <div className="bg-layer bg-beams"></div>
          <div className="bg-layer bg-grid"></div>
          <div className="bg-layer bg-particles"></div>
          <div className="bg-shapes">
            <div className="shape shape-1"><div className="shape-inner"></div></div>
            <div className="shape shape-2"><div className="shape-inner"></div></div>
            <div className="shape shape-3"><div className="shape-inner"></div></div>
          </div>
        </div>

        {/* Background Vertical Guide Lines */}
        <div className="fixed inset-0 pointer-events-none flex justify-between px-8 opacity-[0.03] z-0">
          <div className="w-px h-full bg-[#16382b]"></div>
          <div className="w-px h-full bg-[#16382b] hidden md:block"></div>
          <div className="w-px h-full bg-[#16382b] hidden md:block"></div>
          <div className="w-px h-full bg-[#16382b]"></div>
        </div>

        {/* Hero */}
        <section className="border-b border-[#16382b]/10 bg-[#e0d7d3]/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-5xl px-8 py-10 sm:py-14">
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#4a5c52] mb-4 reveal">Size Guide</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-serif tracking-tight hero-title-glow reveal text-[#16382b]">
              איך מודדים מידה לצמיד / טבעת בבית?
            </h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base leading-6 text-[#4a5c52] font-light reveal">
              בחרו את השיטה שנוחה לכם. מומלץ למדוד פעמיים ולוודא שהתוצאה יציבה.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 reveal">
              <a
                href="#bracelet"
                className="rounded-full border border-[#16382b]/20 bg-[#e0d7d3]/80 backdrop-blur-sm px-4 py-2 text-sm hover:bg-[#16382b]/10 hover:border-[#16382b]/50 hover:text-[#16382b] transition-all text-[#16382b]"
              >
                מדריך לצמידים
              </a>
              <a
                href="#rings"
                className="rounded-full border border-[#16382b]/20 bg-[#e0d7d3]/80 backdrop-blur-sm px-4 py-2 text-sm hover:bg-[#16382b]/10 hover:border-[#16382b]/50 hover:text-[#16382b] transition-all text-[#16382b]"
              >
                מדריך לטבעות
              </a>
            </div>
          </div>
        </section>

        {/* Bracelet */}
        <section id="bracelet" className="container mx-auto max-w-5xl px-8 py-10 sm:py-14 relative z-10">
          <HeaderBlock
            title="מדריך מידות לצמידים"
            subtitle="2 שיטות מהירות למדידה — עם סרגל או בלי."
          />

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardTitle
                title="צמיד עם סרגל"
                badge="מומלץ"
                icon={<IconRuler />}
              />
              <Steps>
                <Step
                  n={1}
                  title="מצאו סרט מדידה / חוט / סרגל"
                  desc="אפשר להשתמש בסרט מדידה, חוט דק או אפילו רצועת נייר."
                  icon={<IconTape />}
                />
                <Step
                  n={2}
                  title="מדדו היקף סביב פרק כף היד"
                  desc="סובבו סביב הפרק בנוחות (לא חזק מדי), וסמנו את נקודת המפגש."
                  icon={<IconWrist />}
                />
                <Step
                  n={3}
                  title="יישרו ומדדו בסרגל"
                  desc="יישרו את החוט/נייר על סרגל ומדדו את האורך בס״מ."
                  icon={<IconMeasure />}
                />
                <Step
                  n={4}
                  title="בחרו מידה לפי הטבלה"
                  desc="השוו את התוצאה לטבלת המידות למטה."
                  icon={<IconTable />}
                />
              </Steps>

              <SizeTable
                headers={["היקף בס״מ", "מידה"]}
                rows={[
                  ["15–16", "S"],
                  ["17–18", "M"],
                  ["19–20", "L"],
                ]}
                note="אם אתם בין מידות — לרוב עדיף לבחור מידה אחת למעלה לנוחות."
              />
            </Card>

            <Card>
              <CardTitle
                title="צמיד קשיח"
                badge="לצמידים קשיחים"
                icon={<IconBangle />}
              />
              <Steps>
                <Step
                  n={1}
                  title="כופפו את האגודל לכיוון כף היד"
                  desc="ככה מתקבל החלק הרחב ביותר של כף היד (כניסה של צמיד קשיח)."
                  icon={<IconThumb />}
                />
                <Step
                  n={2}
                  title="לפפו חוט סביב כף היד"
                  desc="מדדו סביב החלק הרחב ביותר כשהאגודל כפוף."
                  icon={<IconWrap />}
                />
                <Step
                  n={3}
                  title="מדדו בסרגל"
                  desc="יישרו את החוט ומדדו את האורך בס״מ."
                  icon={<IconMeasure />}
                />
                <Step
                  n={4}
                  title="בחרו מידה לפי הטבלה"
                  desc="השוו לתוצאה בטבלת המידות."
                  icon={<IconTable />}
                />
              </Steps>

              <SizeTable
                headers={["היקף בס״מ", "מידה"]}
                rows={[
                  ["15–16", "S"],
                  ["17–18", "M"],
                  ["19–20", "L"],
                ]}
                note="צמיד קשיח צריך לעבור את כף היד — אם ספק, קחו מידה גדולה יותר."
              />
            </Card>
          </div>

          <Callout>
            טיפ: מדדו בשעות הערב כשכף היד מעט "מלאה" יותר — זה נותן מידה מציאותית יותר.
          </Callout>
        </section>

        {/* Rings */}
        <section id="rings" className="border-t border-[#16382b]/10 bg-[#e0d7d3]/80 backdrop-blur-sm relative z-10">
          <div className="container mx-auto max-w-5xl px-8 py-10 sm:py-14">
            <HeaderBlock
              title="מדריך מידות לטבעות"
              subtitle="מדידה באפליקציה / לפי טבעת קיימת / עם חוט."
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <Card>
                <CardTitle title="דרך אפליקציה" badge="הכי קל" icon={<IconPhone />} />
                <Steps compact>
                  <Step
                    n={1}
                    title="הורידו אפליקציית Ring Sizer"
                    desc='חפשו "Ring Sizer" בחנות האפליקציות.'
                    icon={<IconDownload />}
                  />
                  <Step
                    n={2}
                    title="מדדו לפי ההנחיות"
                    desc="האפליקציה תציג מדריך לצילום/השוואה ותקבלו מידה."
                    icon={<IconTarget />}
                  />
                </Steps>
                <SmallNote>
                  שימו לב: חשוב להגדיר נכון את קנה המידה באפליקציה (Calibration).
                </SmallNote>
              </Card>

              <Card>
                <CardTitle
                  title="טבעת קיימת על נייר"
                  badge="מדויק"
                  icon={<IconRing />}
                />
                <Steps compact>
                  <Step
                    n={1}
                    title="מדדו קוטר פנימי בס״מ"
                    desc="הניחו טבעת על נייר/סרגל ומדדו את הקוטר הפנימי."
                    icon={<IconRuler />}
                  />
                  <Step
                    n={2}
                    title="השוו לטבלה"
                    desc="חפשו את הקוטר שלכם בטבלה ובחרו מידת US."
                    icon={<IconTable />}
                  />
                </Steps>

                <SizeTable
                  headers={["מידת US", "קוטר פנימי (מ״מ)"]}
                  rows={[
                    ["4", "14.8"],
                    ["4.5", "15.2"],
                    ["5", "15.7"],
                    ["5.5", "16.1"],
                    ["6", "16.5"],
                    ["6.5", "16.9"],
                    ["7", "17.3"],
                    ["7.5", "17.7"],
                    ["8", "18.1"],
                    ["8.5", "18.5"],
                    ["9", "18.9"],
                    ["9.5", "19.4"],
                    ["10", "19.8"],
                    ["10.5", "20.2"],
                    ["11", "20.6"],
                  ]}
                  note="אם הקוטר שלכם בין שתי מידות — לרוב עדיף לבחור את המידה הגבוהה יותר."
                />
              </Card>

              <Card>
                <CardTitle title="חוט / נייר סביב האצבע" badge="בבית" icon={<IconWrap />} />
                <Steps compact>
                  <Step
                    n={1}
                    title="לפפו סביב האצבע"
                    desc="סביב האצבע במקום שבו הטבעת תישב (בנוחות, לא חזק מדי)."
                    icon={<IconFinger />}
                  />
                  <Step
                    n={2}
                    title="סמנו נקודת מפגש"
                    desc="סמנו בעיפרון איפה הקצוות נפגשים."
                    icon={<IconMark />}
                  />
                  <Step
                    n={3}
                    title="מדדו בסרגל"
                    desc="יישרו ומדדו את האורך — זה ההיקף."
                    icon={<IconMeasure />}
                  />
                  <Step
                    n={4}
                    title="המירו למידה"
                    desc="השוו לטבלת מידות באתר/יצרן (היקף → מידה)."
                    icon={<IconTable />}
                  />
                </Steps>
                <SmallNote>
                  חשוב: אם יש "פרק" רחב באצבע, מדדו גם שם כדי שהטבעת תעבור בקלות.
                </SmallNote>
              </Card>
            </div>

            <div className="mt-8 rounded-2xl border border-[#16382b]/20 glass-panel p-5">
              <p className="text-sm font-medium text-[#16382b]">הערות חשובות</p>
              <ul className="mt-2 list-disc space-y-2 pr-5 text-sm text-[#4a5c52] font-light">
                <li>מדדו בטמפרטורה רגילה (קור/חום משפיעים על נפיחות האצבע).</li>
                <li>לטבעות רחבות — לעיתים מומלץ לקחת חצי מידה למעלה.</li>
                <li>אם אתם מתלבטים — שלחו לנו הודעה ונעזור להתאים.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer mini */}
        <footer className="border-t border-[#16382b]/10 bg-[#e0d7d3]/80 backdrop-blur-sm relative z-10">
          <div className="container mx-auto max-w-5xl px-8 py-8 text-sm text-[#4a5c52] text-center">
            <p className="text-xs font-light">
              * המדריך מיועד להכוונה כללית. ייתכנו סטיות קלות בין יצרנים/דגמים.
            </p>
          </div>
        </footer>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function HeaderBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-serif tracking-tight hero-title-glow">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400 font-light">{subtitle}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-3xl border border-[#16382b]/20 p-5 shadow-soft-xl">
      {children}
    </div>
  );
}

function CardTitle({
  title,
  badge,
  icon,
}: {
  title: string;
  badge?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-serif">{title}</h3>
          {badge ? (
            <span className="rounded-full border border-[#16382b]/30 bg-[#16382b]/10 px-2 py-0.5 text-[10px] text-[#16382b] uppercase tracking-wider">
              {badge}
            </span>
          ) : null}
        </div>
      </div>
      {icon ? (
        <div className="rounded-2xl border border-[#16382b]/20 bg-[#E8E0D5]/50 p-2 text-[#4a5c52]">{icon}</div>
      ) : null}
    </div>
  );
}

function Steps({
  children,
  compact,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`mt-4 grid gap-3 ${compact ? "" : ""}`}>{children}</div>
  );
}

function Step({
  n,
  title,
  desc,
  icon,
}: {
  n: number;
  title: string;
  desc: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#16382b]/20 bg-[#e0d7d3]/80 backdrop-blur-sm p-3 hover:border-[#16382b]/40 transition-colors">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#16382b]/20 bg-[#E8E0D5]/50 text-sm font-serif text-[#16382b]">
        {n}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#16382b]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#4a5c52] font-light">{desc}</p>
      </div>
      {icon ? <div className="hidden sm:block opacity-50 text-[#4a5c52]">{icon}</div> : null}
    </div>
  );
}

function SizeTable({
  headers,
  rows,
  note,
}: {
  headers: string[];
  rows: string[][];
  note?: string;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#16382b]/20">
      <table className="w-full text-right text-sm">
        <thead className="bg-[#E8E0D5]/50 text-[#4a5c52] border-b border-[#16382b]/20">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#e0d7d3]/80">
          {rows.map((r, idx) => (
            <tr key={idx} className="border-t border-[#16382b]/20 hover:bg-[#E8E0D5]/30 transition-colors">
              {r.map((c, i) => (
                <td key={i} className="px-4 py-3 text-[#16382b] font-light">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {note ? (
        <div className="border-t border-[#16382b]/20 bg-[#E8E0D5]/30 px-4 py-3 text-xs text-[#4a5c52] font-light">
          {note}
        </div>
      ) : null}
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-3xl border border-[#16382b]/30 bg-[#16382b]/5 glass-panel p-5 shadow-soft-xl">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-[#16382b]/30 bg-[#16382b]/10 p-2 text-[#16382b]">
          <IconInfo />
        </div>
        <p className="text-sm leading-6 text-[#16382b] font-light">{children}</p>
      </div>
    </div>
  );
}

function SmallNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-xs leading-5 text-[#4a5c52] font-light">{children}</p>
  );
}

/* ---------------- Icons ---------------- */

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function IconInfo() {
  return (
    <Svg>
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 10v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M12 7h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconRuler() {
  return (
    <Svg>
      <path d="M4 16l10-10 6 6-10 10H4v-6Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 11l-1 1M11 13l-1 1M13 15l-1 1M15 17l-1 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconTape() {
  return (
    <Svg>
      <path d="M8 6h8a4 4 0 1 1 0 8H8a4 4 0 1 1 0-8Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 10h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M12 14v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconWrist() {
  return (
    <Svg>
      <path d="M7 6c2 2 3 4 3 6s-1 4-3 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M17 6c-2 2-3 4-3 6s1 4 3 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconMeasure() {
  return (
    <Svg>
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M6 18v-3M9 18v-2M12 18v-3M15 18v-2M18 18v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconTable() {
  return (
    <Svg>
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M4 10h16M10 6v12" stroke="currentColor" strokeWidth="1.6"/>
    </Svg>
  );
}
function IconBangle() {
  return (
    <Svg>
      <path d="M12 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconThumb() {
  return (
    <Svg>
      <path d="M8 12l3-6c.5-1 2-.7 2 .5V11h5v7h-8l-2-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </Svg>
  );
}
function IconWrap() {
  return (
    <Svg>
      <path d="M5 12c3-4 11-4 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M5 12c3 4 11 4 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconPhone() {
  return (
    <Svg>
      <path d="M9 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconDownload() {
  return (
    <Svg>
      <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconTarget() {
  return (
    <Svg>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 12h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconRing() {
  return (
    <Svg>
      <path d="M12 20c4 0 7-3 7-7S16 6 12 6 5 9 5 13s3 7 7 7Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconFinger() {
  return (
    <Svg>
      <path d="M8 20v-8c0-2 1-3 3-3h2c2 0 3 1 3 3v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M10 9V6c0-1 1-2 2-2s2 1 2 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
function IconMark() {
  return (
    <Svg>
      <path d="M4 20l6-2 10-10-4-4L6 14 4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M13 5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}


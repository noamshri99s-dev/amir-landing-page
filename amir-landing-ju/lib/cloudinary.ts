/**
 * Cloudinary – רק כדי שהתמונות של הקטלוג ייטענו.
 * קישורים עם עברית חייבים קידוד, אחרת הדפדפן לא טוען.
 */

const BASE = "https://res.cloudinary.com/de937ijky/image/upload/f_auto,q_auto/";

/**
 * מחזיר קישור תמונה שעובד בדפדפן.
 * אם ה-URL כבר מקודד (מכיל %) – מחזירים כמו שהוא.
 * אחרת מקדדים עברית/רווחים.
 */
export function cloudinaryUrl(url: string): string {
  if (!url.startsWith("https://res.cloudinary.com/")) {
    return url;
  }
  if (url.includes("%")) {
    return url;
  }
  const i = url.indexOf("/image/upload/");
  if (i === -1) return url;
  const after = url.slice(i + "/image/upload/".length);
  const path = after.replace(/^f_auto,q_auto\//, "");
  const encoded = path
    .split("/")
    .map((p) => {
      try {
        return encodeURIComponent(decodeURIComponent(p));
      } catch {
        return encodeURIComponent(p);
      }
    })
    .join("/");
  return BASE + encoded;
}

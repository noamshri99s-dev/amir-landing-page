import twilio from 'twilio';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

// Twilio configuration (set these in .env file)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

// Messages for different genders - 20% discount for birthday
const MALE_BIRTHDAY_MESSAGE = `🎉 יום הולדת שמח מ-AVIVI!
לכבוד היום המיוחד שלך, קבל הנחה של 20% על כל התכשיטים שלנו!
השתמש בקוד: BIRTHDAY20
בתוקף ל-7 ימים 💎
https://avivi.co.il`;

const FEMALE_BIRTHDAY_MESSAGE = `💎 יום הולדת שמח ומבריק מ-AVIVI!
לכבוד היום המיוחד שלך, קבלי הנחה של 20% על כל התכשיטים שלנו!
השתמשי בקוד: BIRTHDAY20
בתוקף ל-7 ימים ✨
https://avivi.co.il`;

// Welcome message for new members joining the birthday club
const WELCOME_MESSAGE = `AVIVI Diamonds
ברוכים הבאים למעגל הלקוחות שלנו! 💎
צרפת בהצלחה למעגל הלקוחות המיוחד שלנו ותקבל/י הודעות על מבצעים, הנחות מיוחדות והנחה של 20% ביום ההולדת שלך!
נשמח לראות אותך אצלנו ✨
https://avivi.co.il`;

// Function to send welcome message to new members
export async function sendWelcomeMessage(phone) {
  return await sendSMS(phone, WELCOME_MESSAGE);
}

// Function to send birthday message to a specific phone
export async function sendBirthdayMessage(phone, gender) {
  const message = gender === 'female' ? FEMALE_BIRTHDAY_MESSAGE : MALE_BIRTHDAY_MESSAGE;
  return await sendSMS(phone, message);
}

export async function sendSMS(to, message) {
  if (!client) {
    console.log(`[SMS] Would send to ${to}: ${message}`);
    console.log('⚠️  Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
    
    // Log to Supabase anyway for testing
    if (supabase) {
      try {
        await supabase.from('sms_log').insert([
          {
            phone: to,
            message: message,
            success: false,
            error_message: 'Twilio not configured'
          }
        ]);
      } catch (error) {
        console.error('Error logging SMS to Supabase:', error);
      }
    }
    
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    // Format Israeli phone number (add +972 prefix if needed)
    let formattedPhone = to;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+972' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+972' + formattedPhone;
    }

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedPhone
    });

    // Log successful send to Supabase
    if (supabase) {
      try {
        await supabase.from('sms_log').insert([
          {
            phone: to,
            message: message,
            success: true,
            error_message: null
          }
        ]);
      } catch (error) {
        console.error('Error logging SMS to Supabase:', error);
      }
    }

    console.log(`✅ SMS sent to ${to}: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${to}:`, error.message);
    
    // Log failed send to Supabase
    if (supabase) {
      try {
        await supabase.from('sms_log').insert([
          {
            phone: to,
            message: message,
            success: false,
            error_message: error.message
          }
        ]);
      } catch (logError) {
        console.error('Error logging SMS to Supabase:', logError);
      }
    }
    
    return { success: false, error: error.message };
  }
}

export async function checkBirthdays() {
  if (!supabase) {
    console.error('❌ Supabase not configured. Cannot check birthdays.');
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Get all birthday leads from Supabase
    // We need to check if the month and day match today
    const { data: allBirthdays, error: fetchError } = await supabase
      .from('birthday_leads')
      .select('*');

    if (fetchError) {
      console.error('Error fetching birthdays:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Filter birthdays that match today (month and day)
    const todayBirthdays = (allBirthdays || []).filter(lead => {
      if (!lead.birthday) return false;
      const birthdayDate = new Date(lead.birthday);
      const birthdayMonth = String(birthdayDate.getMonth() + 1).padStart(2, '0');
      const birthdayDay = String(birthdayDate.getDate()).padStart(2, '0');
      return birthdayMonth === month && birthdayDay === day;
    });
    
    console.log(`Found ${todayBirthdays.length} birthdays today`);
    
    for (const lead of todayBirthdays) {
      // Choose message based on gender
      let message;
      if (lead.gender === 'female') {
        message = FEMALE_BIRTHDAY_MESSAGE;
      } else {
        message = MALE_BIRTHDAY_MESSAGE;
      }
      
      await sendSMS(lead.phone, message);
      
      // Small delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return { success: true, count: todayBirthdays.length };
  } catch (error) {
    console.error('Error checking birthdays:', error);
    return { success: false, error: error.message };
  }
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendSMS, checkBirthdays, sendBirthdayMessage, sendWelcomeMessage } from './sms.js';
import { supabase } from './supabase.js';
import * as cron from 'node-cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Admin credentials (you can set these in .env file)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================
// SMS MANAGEMENT ENDPOINTS
// ============================================

// Get today's birthdays
app.get('/api/admin/todays-birthdays', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Get all birthday leads
    const { data: allBirthdays, error: fetchError } = await supabase
      .from('birthday_leads')
      .select('*');

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    // Filter birthdays that match today (month and day)
    const todayBirthdays = (allBirthdays || []).filter(lead => {
      if (!lead.birthday) return false;
      const birthdayDate = new Date(lead.birthday);
      const birthdayMonth = String(birthdayDate.getMonth() + 1).padStart(2, '0');
      const birthdayDay = String(birthdayDate.getDate()).padStart(2, '0');
      return birthdayMonth === month && birthdayDay === day;
    });

    res.json({ success: true, birthdays: todayBirthdays });
  } catch (error) {
    console.error('Error fetching today\'s birthdays:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s birthdays' });
  }
});

// Get birthdays for a specific date
app.get('/api/admin/birthdays-by-date', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { month, day } = req.query;
    
    if (!month || !day) {
      return res.status(400).json({ error: 'Month and day are required' });
    }
    
    // Get all birthday leads
    const { data: allBirthdays, error: fetchError } = await supabase
      .from('birthday_leads')
      .select('*');

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    // Filter birthdays that match the specified date
    const matchingBirthdays = (allBirthdays || []).filter(lead => {
      if (!lead.birthday) return false;
      const birthdayDate = new Date(lead.birthday);
      const birthdayMonth = String(birthdayDate.getMonth() + 1).padStart(2, '0');
      const birthdayDay = String(birthdayDate.getDate()).padStart(2, '0');
      return birthdayMonth === month && birthdayDay === day;
    });

    res.json({ success: true, birthdays: matchingBirthdays });
  } catch (error) {
    console.error('Error fetching birthdays by date:', error);
    res.status(500).json({ error: 'Failed to fetch birthdays' });
  }
});

// Send welcome SMS to a new member
app.post('/api/admin/send-welcome-sms', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    const result = await sendWelcomeMessage(phone);
    
    if (result.success) {
      res.json({ success: true, message: 'Welcome SMS sent successfully' });
    } else {
      res.status(500).json({ error: result.error || 'Failed to send SMS' });
    }
  } catch (error) {
    console.error('Error sending welcome SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send birthday SMS to a specific person
app.post('/api/admin/send-birthday-sms', async (req, res) => {
  try {
    const { phone, gender } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    const result = await sendBirthdayMessage(phone, gender);
    
    if (result.success) {
      res.json({ success: true, message: 'SMS sent successfully' });
    } else {
      res.status(500).json({ error: result.error || 'Failed to send SMS' });
    }
  } catch (error) {
    console.error('Error sending birthday SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send custom SMS
app.post('/api/admin/send-sms', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required' });
    }

    const result = await sendSMS(phone, message);
    
    if (result.success) {
      res.json({ success: true, message: 'SMS sent successfully' });
    } else {
      res.status(500).json({ error: result.error || 'Failed to send SMS' });
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send SMS to all today's birthdays
app.post('/api/admin/send-all-birthday-sms', async (req, res) => {
  try {
    const result = await checkBirthdays();
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: `נשלחו ${result.count} הודעות יום הולדת`,
        count: result.count 
      });
    } else {
      res.status(500).json({ error: result.error || 'Failed to send birthday SMS' });
    }
  } catch (error) {
    console.error('Error sending all birthday SMS:', error);
    res.status(500).json({ error: 'Failed to send birthday SMS' });
  }
});

// Get SMS log
app.get('/api/admin/sms-log', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { data, error } = await supabase
      .from('sms_log')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, logs: data || [] });
  } catch (error) {
    console.error('Error fetching SMS log:', error);
    res.status(500).json({ error: 'Failed to fetch SMS log' });
  }
});

// ============================================
// LEGACY ENDPOINTS (kept for backwards compatibility)
// Note: Frontend now uses Supabase directly
// ============================================

// Save lead from LeadForm (via backend - optional)
app.post('/api/leads', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { name, phone, interest } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([{ name, phone, interest: interest || null }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true, id: data[0]?.id });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

// Save birthday lead from BirthdayPopup (via backend - optional)
app.post('/api/birthday-leads', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { phone, birthday, gender } = req.body;
    
    if (!phone || !birthday) {
      return res.status(400).json({ error: 'Phone and birthday are required' });
    }

    // Check if this phone number already exists in birthday_leads
    const { data: existingLead, error: checkError } = await supabase
      .from('birthday_leads')
      .select('phone')
      .eq('phone', phone)
      .single();

    const isNewMember = !existingLead || checkError?.code === 'PGRST116'; // PGRST116 = no rows returned

    const { data, error } = await supabase
      .from('birthday_leads')
      .upsert([{ phone, birthday, gender: gender || null }], { onConflict: 'phone' })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // If this is a new member, send welcome SMS
    if (isNewMember) {
      try {
        const smsResult = await sendWelcomeMessage(phone);
        if (smsResult.success) {
          console.log(`✅ Welcome SMS sent to new member: ${phone}`);
        } else {
          console.error(`❌ Failed to send welcome SMS to ${phone}:`, smsResult.error);
        }
      } catch (smsError) {
        console.error('Error sending welcome SMS:', smsError);
        // Don't fail the request if SMS fails
      }
    }
    
    res.json({ success: true, id: data[0]?.id, isNewMember });
  } catch (error) {
    console.error('Error saving birthday lead:', error);
    res.status(500).json({ error: 'Failed to save birthday lead' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📅 Birthday SMS will be sent daily at 9:00 AM');
  
  // Run birthday check every day at 9 AM
  cron.schedule('0 9 * * *', () => {
    console.log('🎂 Running daily birthday check...');
    checkBirthdays();
  });
  
  // Log Twilio configuration status
  if (process.env.TWILIO_ACCOUNT_SID) {
    console.log('✅ Twilio configured');
  } else {
    console.log('⚠️  Twilio not configured - SMS will be logged but not sent');
  }
});


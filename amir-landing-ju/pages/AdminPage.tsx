import React, { useState, useEffect } from 'react';
import { LogOut, Users, Calendar, MessageSquare, RefreshCw, Send, Gift, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface Lead {
  id: number;
  name: string | null;
  phone: string | null;
  interest: string | null;
  created_at: string;
}

interface BirthdayLead {
  id: number;
  phone: string;
  birthday: string;
  gender: string | null;
  created_at: string;
}

interface SmsLog {
  id: number;
  phone: string;
  message: string;
  success: boolean;
  error_message: string | null;
  sent_at: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [birthdayLeads, setBirthdayLeads] = useState<BirthdayLead[]>([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState<BirthdayLead[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'birthdays' | 'sms'>('leads');
  
  // SMS sending states
  const [sendingAll, setSendingAll] = useState(false);
  const [sendingSingle, setSendingSingle] = useState<number | null>(null);
  const [smsSuccess, setSmsSuccess] = useState<string | null>(null);
  const [smsError, setSmsError] = useState<string | null>(null);
  
  // Custom message state
  const [customPhone, setCustomPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingCustom, setSendingCustom] = useState(false);

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }

    // Check if already authenticated
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const checkSession = async () => {
    if (!supabase) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err) {
      console.error('Error checking session:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setError('Supabase לא מוגדר. אנא הגדר את המשתנים הסביבתיים.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error details:', error);
        // Show more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('שם משתמש או סיסמה שגויים');
        } else if (error.message.includes('Email not confirmed')) {
          setError('המייל לא אושר. אנא בדוק את תיבת הדואר הנכנס.');
        } else {
          setError(`שגיאה: ${error.message}`);
        }
      } else if (data.session) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err: any) {
      setError('שגיאה בהתחברות. נסה שוב.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchData = async () => {
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }

    try {
      if (activeTab === 'leads') {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching leads:', error);
        } else {
          setLeads(data || []);
        }
      } else if (activeTab === 'birthdays') {
        const { data, error } = await supabase
          .from('birthday_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching birthday leads:', error);
        } else {
          setBirthdayLeads(data || []);
        }
      } else if (activeTab === 'sms') {
        // Fetch today's birthdays
        await fetchTodaysBirthdays();
        // Fetch SMS logs
        await fetchSmsLogs();
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchTodaysBirthdays = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/todays-birthdays`);
      const data = await response.json();
      if (data.success) {
        setTodaysBirthdays(data.birthdays || []);
      }
    } catch (err) {
      console.error('Error fetching today\'s birthdays:', err);
      // Fallback: calculate today's birthdays from all birthday leads
      if (supabase) {
        const { data } = await supabase.from('birthday_leads').select('*');
        if (data) {
          const today = new Date();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          
          const filtered = data.filter(lead => {
            if (!lead.birthday) return false;
            const birthdayDate = new Date(lead.birthday);
            const birthdayMonth = String(birthdayDate.getMonth() + 1).padStart(2, '0');
            const birthdayDay = String(birthdayDate.getDate()).padStart(2, '0');
            return birthdayMonth === month && birthdayDay === day;
          });
          setTodaysBirthdays(filtered);
        }
      }
    }
  };

  const fetchSmsLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/sms-log`);
      const data = await response.json();
      if (data.success) {
        setSmsLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching SMS logs:', err);
      // Fallback to Supabase direct query
      if (supabase) {
        const { data } = await supabase
          .from('sms_log')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(100);
        if (data) {
          setSmsLogs(data);
        }
      }
    }
  };

  const sendBirthdaySmsToAll = async () => {
    setSendingAll(true);
    setSmsSuccess(null);
    setSmsError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/send-all-birthday-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        setSmsSuccess(data.message || `נשלחו ${data.count} הודעות בהצלחה!`);
        fetchSmsLogs();
      } else {
        setSmsError(data.error || 'שגיאה בשליחת ההודעות');
      }
    } catch (err) {
      setSmsError('שגיאה בחיבור לשרת');
    } finally {
      setSendingAll(false);
    }
  };

  const sendBirthdaySmsToOne = async (phone: string, gender: string | null, id: number) => {
    setSendingSingle(id);
    setSmsSuccess(null);
    setSmsError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/send-birthday-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, gender })
      });
      const data = await response.json();
      
      if (data.success) {
        setSmsSuccess(`הודעה נשלחה בהצלחה ל-${phone}`);
        fetchSmsLogs();
      } else {
        setSmsError(data.error || 'שגיאה בשליחת ההודעה');
      }
    } catch (err) {
      setSmsError('שגיאה בחיבור לשרת');
    } finally {
      setSendingSingle(null);
    }
  };

  const sendCustomSms = async () => {
    if (!customPhone.trim() || !customMessage.trim()) {
      setSmsError('יש למלא טלפון והודעה');
      return;
    }
    
    setSendingCustom(true);
    setSmsSuccess(null);
    setSmsError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: customPhone, message: customMessage })
      });
      const data = await response.json();
      
      if (data.success) {
        setSmsSuccess(`הודעה נשלחה בהצלחה ל-${customPhone}`);
        setCustomPhone('');
        setCustomMessage('');
        fetchSmsLogs();
      } else {
        setSmsError(data.error || 'שגיאה בשליחת ההודעה');
      }
    } catch (err) {
      setSmsError('שגיאה בחיבור לשרת');
    } finally {
      setSendingCustom(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBirthday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#e0d7d3] flex items-center justify-center p-6">
        <div className="glass-panel p-12 md:p-16 rounded-[40px] shadow-soft-xl w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-4 text-[#16382b]">Admin Login</h1>
            <p className="text-[#4a5c52] text-sm font-light">הזן כתובת מייל וסיסמה</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#4a5c52] mb-4">
                כתובת מייל
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#16382b]/30 focus:border-[#16382b] py-4 outline-none transition-all text-[#16382b] text-lg font-light"
                dir="ltr"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#4a5c52] mb-4">
                סיסמה
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#16382b]/30 focus:border-[#16382b] py-4 outline-none transition-all text-[#16382b] text-lg font-light"
                dir="ltr"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#16382b] text-[#e0d7d3] uppercase tracking-[0.3em] font-bold text-[10px] hover:bg-[#1f4a3a] transition-colors rounded-full disabled:opacity-50"
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0d7d3] text-[#16382b]">
      {/* Header */}
      <header className="bg-[#e0d7d3]/90 backdrop-blur-md border-b border-[#16382b]/10 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-serif tracking-[0.25em] text-[#16382b]">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#4a5c52] hover:text-[#16382b] transition-colors text-sm uppercase tracking-[0.3em]"
          >
            <LogOut size={16} />
            התנתק
          </button>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#16382b]/20 flex-wrap">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-4 px-6 text-sm uppercase tracking-[0.3em] transition-colors flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'text-[#16382b] border-b-2 border-[#16382b]'
                : 'text-[#4a5c52] hover:text-[#16382b]'
            }`}
          >
            <Users size={16} />
            לידים ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`pb-4 px-6 text-sm uppercase tracking-[0.3em] transition-colors flex items-center gap-2 ${
              activeTab === 'birthdays'
                ? 'text-[#16382b] border-b-2 border-[#16382b]'
                : 'text-[#4a5c52] hover:text-[#16382b]'
            }`}
          >
            <Calendar size={16} />
            תאריכי לידה ({birthdayLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`pb-4 px-6 text-sm uppercase tracking-[0.3em] transition-colors flex items-center gap-2 ${
              activeTab === 'sms'
                ? 'text-[#16382b] border-b-2 border-[#16382b]'
                : 'text-[#4a5c52] hover:text-[#16382b]'
            }`}
          >
            <MessageSquare size={16} />
            שליחת SMS
          </button>
          <button
            onClick={fetchData}
            className="mr-auto pb-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] hover:text-[#16382b] transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            רענן
          </button>
        </div>

        {/* Content */}
        <div className="glass-panel rounded-[40px] shadow-soft-xl p-8 overflow-x-auto">
          {activeTab === 'leads' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">לידים</h2>
              {leads.length === 0 ? (
                <p className="text-[#4a5c52] text-center py-12">אין לידים עדיין</p>
              ) : (
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-[#16382b]/20">
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">תאריך</th>
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">מה מעניין</th>
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">טלפון</th>
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">שם</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-[#16382b]/10 hover:bg-[#16382b]/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light">{formatDate(lead.created_at)}</td>
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light">{lead.interest || '-'}</td>
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light" dir="ltr">{lead.phone || '-'}</td>
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light">{lead.name || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'birthdays' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">תאריכי לידה</h2>
              {birthdayLeads.length === 0 ? (
                <p className="text-[#4a5c52] text-center py-12">אין תאריכי לידה עדיין</p>
              ) : (
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-[#16382b]/20">
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">תאריך רישום</th>
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">תאריך לידה</th>
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">מין</th>
                      <th className="py-4 px-6 text-sm uppercase tracking-[0.3em] text-[#4a5c52] font-light">טלפון</th>
                    </tr>
                  </thead>
                  <tbody>
                    {birthdayLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-[#16382b]/10 hover:bg-[#16382b]/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light">{formatDate(lead.created_at)}</td>
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light">{formatBirthday(lead.birthday)}</td>
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light">
                          {lead.gender === 'male' ? 'גבר' : lead.gender === 'female' ? 'אישה' : '-'}
                        </td>
                        <td className="py-4 px-6 text-sm text-[#16382b] font-light" dir="ltr">{lead.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-8">
              {/* Success/Error Messages */}
              {smsSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <CheckCircle size={20} />
                  {smsSuccess}
                </div>
              )}
              {smsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <XCircle size={20} />
                  {smsError}
                </div>
              )}

              {/* Today's Birthdays Section */}
              <div className="bg-[#16382b]/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Gift className="text-[#16382b]" size={24} />
                    <h2 className="text-2xl font-serif">ימי הולדת היום</h2>
                    <span className="bg-[#16382b] text-white text-sm px-3 py-1 rounded-full">
                      {todaysBirthdays.length}
                    </span>
                  </div>
                  {todaysBirthdays.length > 0 && (
                    <button
                      onClick={sendBirthdaySmsToAll}
                      disabled={sendingAll}
                      className="flex items-center gap-2 bg-[#16382b] text-white px-6 py-3 rounded-full hover:bg-[#1f4a3a] transition-colors disabled:opacity-50"
                    >
                      <Send size={16} />
                      {sendingAll ? 'שולח...' : 'שלח לכולם'}
                    </button>
                  )}
                </div>

                {todaysBirthdays.length === 0 ? (
                  <p className="text-[#4a5c52] text-center py-8">אין ימי הולדת היום</p>
                ) : (
                  <div className="space-y-3">
                    {todaysBirthdays.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="bg-white/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            {lead.gender === 'female' ? '👩' : '👨'}
                          </div>
                          <div>
                            <p className="font-medium text-[#16382b]" dir="ltr">{lead.phone}</p>
                            <p className="text-sm text-[#4a5c52]">
                              {lead.gender === 'male' ? 'גבר' : lead.gender === 'female' ? 'אישה' : '-'} • 
                              יום הולדת: {formatBirthday(lead.birthday)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => sendBirthdaySmsToOne(lead.phone, lead.gender, lead.id)}
                          disabled={sendingSingle === lead.id}
                          className="flex items-center gap-2 bg-[#16382b]/10 text-[#16382b] px-4 py-2 rounded-full hover:bg-[#16382b]/20 transition-colors disabled:opacity-50"
                        >
                          <Send size={14} />
                          {sendingSingle === lead.id ? 'שולח...' : 'שלח SMS'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom SMS Section */}
              <div className="bg-[#16382b]/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="text-[#16382b]" size={24} />
                  <h2 className="text-2xl font-serif">שליחת הודעה מותאמת אישית</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#4a5c52] mb-2">מספר טלפון</label>
                    <input
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="05X-XXXXXXX"
                      dir="ltr"
                      className="w-full bg-white/80 border border-[#16382b]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#16382b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4a5c52] mb-2">תוכן ההודעה</label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="הקלד את ההודעה כאן..."
                      rows={4}
                      className="w-full bg-white/80 border border-[#16382b]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#16382b] transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={sendCustomSms}
                    disabled={sendingCustom || !customPhone.trim() || !customMessage.trim()}
                    className="flex items-center gap-2 bg-[#16382b] text-white px-6 py-3 rounded-full hover:bg-[#1f4a3a] transition-colors disabled:opacity-50"
                  >
                    <Send size={16} />
                    {sendingCustom ? 'שולח...' : 'שלח הודעה'}
                  </button>
                </div>
              </div>

              {/* SMS Log Section */}
              <div className="bg-[#16382b]/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-[#16382b]" size={24} />
                  <h2 className="text-2xl font-serif">היסטוריית הודעות</h2>
                  <span className="bg-[#4a5c52] text-white text-sm px-3 py-1 rounded-full">
                    {smsLogs.length}
                  </span>
                </div>

                {smsLogs.length === 0 ? (
                  <p className="text-[#4a5c52] text-center py-8">אין הודעות עדיין</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {smsLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={`bg-white/80 rounded-2xl p-4 border-r-4 ${
                          log.success ? 'border-green-500' : 'border-red-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {log.success ? (
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                              ) : (
                                <XCircle size={16} className="text-red-500 flex-shrink-0" />
                              )}
                              <span className="font-medium text-[#16382b]" dir="ltr">{log.phone}</span>
                            </div>
                            <p className="text-sm text-[#4a5c52] line-clamp-2">{log.message}</p>
                            {log.error_message && (
                              <p className="text-sm text-red-500 mt-1">{log.error_message}</p>
                            )}
                          </div>
                          <div className="text-xs text-[#4a5c52] whitespace-nowrap">
                            {formatDate(log.sent_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

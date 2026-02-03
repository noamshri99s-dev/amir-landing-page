import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    birthday: '',
    gender: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!supabase) {
        console.error('Supabase not configured');
        // Still show success to user
        setSubmitSuccess(true);
        setFormData({ name: '', phone: '', interest: '', birthday: '', gender: '' });
        setTimeout(() => setSubmitSuccess(false), 3000);
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            interest: formData.interest || null,
          }
        ]);

      if (error) {
        console.error('Error saving lead:', error);
      } else {
        // If birthday is provided, save to birthday_leads directly in Supabase
        if (formData.birthday) {
          try {
            console.log('📝 Attempting to save birthday:', { phone: formData.phone, birthday: formData.birthday, gender: formData.gender });
            
            // Check if this phone already exists
            const { data: existingLead, error: checkError } = await supabase
              .from('birthday_leads')
              .select('phone, birthday')
              .eq('phone', formData.phone)
              .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
              console.error('Error checking existing lead:', checkError);
            }

            const isNewMember = !existingLead;
            console.log('👤 Is new member?', isNewMember, existingLead ? 'Existing:' : 'Not found', existingLead);

            // Save to Supabase using upsert
            const { data: savedData, error: birthdayError } = await supabase
              .from('birthday_leads')
              .upsert([
                {
                  phone: formData.phone,
                  birthday: formData.birthday,
                  gender: formData.gender || null,
                }
              ], {
                onConflict: 'phone'
              })
              .select();

            if (birthdayError) {
              console.error('❌ Error saving birthday lead:', birthdayError);
              console.error('Error details:', JSON.stringify(birthdayError, null, 2));
            } else {
              console.log('✅ Birthday saved to Supabase!', savedData);
              if (isNewMember) {
                // Call Supabase Edge Function to send welcome SMS
                try {
                  console.log('📞 Attempting to send SMS to:', formData.phone);
                  
                  if (supabase) {
                    const { data: result, error: functionError } = await supabase.functions.invoke('send-welcome-sms', {
                      body: { phone: formData.phone }
                    });

                    if (functionError) {
                      console.error('❌ Edge Function error:', functionError);
                    } else if (result) {
                      if (result.success) {
                        console.log('✅ Welcome SMS sent to new member!', result);
                      } else {
                        console.error('⚠️ SMS sending failed:', result.error);
                      }
                    } else {
                      console.error('❌ No response from Edge Function');
                    }
                  } else {
                    console.error('❌ Supabase client not available');
                  }
                } catch (error) {
                  console.error('❌ Could not send SMS:', error);
                  // Don't fail - data is already saved
                }
              } else {
                console.log('✅ Birthday updated - you will receive SMS on your birthday!');
              }
            }
          } catch (error) {
            console.error('Error processing birthday:', error);
          }
        }

        setSubmitSuccess(true);
        setFormData({ name: '', phone: '', interest: '', birthday: '', gender: '' });
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Still show success to user
      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', interest: '', birthday: '', gender: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-20">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight hero-title-glow">
          היופי <span className="italic">בפרטים הקטנים</span>
        </h2>
        <p className="text-[#6B5B4F] max-w-xl mx-auto font-light leading-relaxed">
          אנחנו מזמינים אתכם לפגישת ייעוץ אישית, בה נוכל להתאים עבורכם את התכשיט המושלם.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-12 py-10">
          <div className="group">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#3D2817] mb-2 block gold-glow">Consultation</span>
            <h4 className="text-xl font-serif mb-3 text-[#3D2817]">ייעוץ אישי ומקצועי</h4>
            <p className="text-[#6B5B4F] text-sm font-light leading-relaxed">גמולוגים מוסמכים ילוו אתכם בבחירת היהלום הנכון ביותר עבורכם, עם דגש על איכות ותקציב.</p>
          </div>
          <div className="group">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#3D2817] mb-2 block gold-glow">Craftsmanship</span>
            <h4 className="text-xl font-serif mb-3 text-[#3D2817]">ייצור בעבודת יד</h4>
            <p className="text-[#6B5B4F] text-sm font-light leading-relaxed">כל תכשיט מיוצר בסטודיו שלנו עם תשומת לב מקסימלית לכל זווית וליטוש.</p>
          </div>
        </div>

        <div className="glass-panel p-12 md:p-16 rounded-[40px] shadow-soft-xl transition-all duration-700">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="שם מלא"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-[#3D2817]/30 focus:border-[#3D2817] py-4 outline-none transition-all placeholder:text-[#6B5B4F] text-lg font-light text-[#3D2817]"
              />
            </div>
            <div className="space-y-4">
              <input 
                type="tel" 
                placeholder="מספר טלפון"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent border-b border-[#3D2817]/30 focus:border-[#3D2817] py-4 outline-none transition-all placeholder:text-[#6B5B4F] text-lg font-light text-[#3D2817]"
              />
            </div>
            <div className="space-y-4">
              <select 
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full bg-transparent border-b border-[#3D2817]/30 focus:border-[#3D2817] py-4 outline-none transition-all text-[#6B5B4F] text-lg font-light appearance-none"
              >
                <option value="">מה מעניין אתכם?</option>
                <option value="טבעות אירוסין">טבעות אירוסין</option>
                <option value="מתנה מיוחדת">מתנה מיוחדת</option>
                <option value="עיצוב אישי">עיצוב אישי</option>
              </select>
            </div>
            <div className="space-y-4">
              <input 
                type="date" 
                placeholder="תאריך לידה (אופציונלי)"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full bg-transparent border-b border-[#3D2817]/30 focus:border-[#3D2817] py-4 outline-none transition-all placeholder:text-[#6B5B4F] text-lg font-light text-[#3D2817]"
              />
              <p className="text-xs text-[#6B5B4F] font-light">אם תמלא תאריך לידה, תקבל הנחה מיוחדת ביום ההולדת שלך</p>
            </div>
            {formData.birthday && (
              <div className="space-y-4">
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-transparent border-b border-[#3D2817]/30 focus:border-[#3D2817] py-4 outline-none transition-all text-[#6B5B4F] text-lg font-light appearance-none"
                >
                  <option value="">מין (אופציונלי)</option>
                  <option value="male">גבר</option>
                  <option value="female">אישה</option>
                </select>
              </div>
            )}
            
            {submitSuccess && (
              <div className="text-green-600 text-sm text-center py-2">
                תודה! נשלח בהצלחה
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center gap-4 text-xs uppercase tracking-[0.4em] font-bold text-[#3D2817] hover:text-[#556B2F] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'שולח...' : 'שלחו בקשה'} <ArrowRight size={16} className="group-hover:translate-x-[-8px] transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;

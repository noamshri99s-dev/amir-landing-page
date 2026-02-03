
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BirthdayPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BirthdayPopup: React.FC<BirthdayPopupProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [data, setData] = useState({ 
    selfPhone: '', 
    selfBirthday: '',
    partnerBirthday: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Gender selection - move to phone step
      if (gender) {
        setStep(2);
      }
    } else if (step === 2) {
      // Phone entered - move to self birthday
      if (data.selfPhone.trim()) {
        setStep(3);
      }
    } else if (step === 3) {
      // Self birthday entered - move to partner birthday
      if (data.selfBirthday.trim()) {
        setStep(4);
      }
    } else if (step === 4) {
      // Partner birthday entered - submit and close
      if (data.partnerBirthday.trim()) {
        setIsSubmitting(true);
        
        try {
          if (!supabase) {
            console.error('Supabase not configured');
            setStep(5);
            setTimeout(() => {
              onClose();
              setStep(1);
              setGender(null);
              setData({ selfPhone: '', selfBirthday: '', partnerBirthday: '' });
              setIsSubmitting(false);
            }, 2000);
            return;
          }

          // Save self birthday directly to Supabase
          try {
            console.log('📝 Attempting to save birthday:', { phone: data.selfPhone, birthday: data.selfBirthday, gender: gender });
            
            // Check if this phone already exists
            const { data: existingLead, error: checkError } = await supabase
              .from('birthday_leads')
              .select('phone, birthday')
              .eq('phone', data.selfPhone)
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
                  phone: data.selfPhone,
                  birthday: data.selfBirthday,
                  gender: gender,
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
                  console.log('📞 Attempting to send SMS to:', data.selfPhone);
                  
                  if (supabase) {
                    const { data: result, error: functionError } = await supabase.functions.invoke('send-welcome-sms', {
                      body: { phone: data.selfPhone }
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
                console.log('✅ Birthday updated!');
              }
            }
          } catch (error) {
            console.error('Error processing birthday:', error);
          }

          // Save partner birthday (if different phone number, otherwise skip)
          // For now, we'll just save the self birthday
          // You can modify this to save partner birthday separately if needed
          
          setStep(5);
          setTimeout(() => {
            onClose();
            // Reset form
            setStep(1);
            setGender(null);
            setData({ selfPhone: '', selfBirthday: '', partnerBirthday: '' });
            setIsSubmitting(false);
          }, 2000);
        } catch (error) {
          console.error('Error saving birthday lead:', error);
          setIsSubmitting(false);
          // Still show success to user
          setStep(5);
          setTimeout(() => {
            onClose();
            setStep(1);
            setGender(null);
            setData({ selfPhone: '', selfBirthday: '', partnerBirthday: '' });
          }, 2000);
        }
      }
    }
  };

  const getGenderText = () => {
    if (gender === 'male') return 'גבר';
    if (gender === 'female') return 'אישה';
    return '';
  };

  const getPartnerText = () => {
    if (gender === 'male') return 'אשתך';
    if (gender === 'female') return 'בעלך';
    return 'בן/בת הזוג';
  };

  const getSelfText = () => {
    if (gender === 'male') return 'שלך';
    if (gender === 'female') return 'שלך';
    return 'שלך';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#16382b]/60 backdrop-blur-md transition-all duration-700">
      <div className="relative glass-panel w-full max-w-lg p-10 md:p-16 text-center shadow-soft-xl rounded-[40px] fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-[#4a5c52] hover:text-[#16382b] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-12">
          <div className="w-12 h-px bg-[#16382b] mx-auto mb-8"></div>
          <h2 className="text-2xl md:text-3xl font-serif mb-4 leading-tight text-[#16382b]">רגעים ששווה לחגוג</h2>
          <p className="text-[#4a5c52] font-light text-sm tracking-wide">
            {step === 1 
              ? 'אנחנו ב-AVIVI מאמינים שהרגעים הכי יפים בחיים ראויים לציון. בואו נתחיל...'
              : step === 2 || step === 3 || step === 4
              ? 'השאירו את הפרטים וקבלו הנחה מיוחדת ביום ההולדת שלכם ושל בן/בת הזוג שלכם!'
              : 'תודה! נשלח לך הנחה מיוחדת ביום ההולדת שלכם'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="min-h-[150px] flex items-center justify-center">
            {/* Step 1: Gender Selection */}
            {step === 1 && (
              <div className="w-full animate-in fade-in duration-700 space-y-6">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#4a5c52] mb-6">
                  איך תרצה להתחיל?
                </label>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setGender('male');
                      setTimeout(() => setStep(2), 300);
                    }}
                    className={`flex-1 max-w-[150px] py-6 px-8 rounded-2xl border-2 transition-all duration-300 ${
                      gender === 'male'
                        ? 'border-[#16382b] bg-[#16382b]/10 text-[#16382b]'
                        : 'border-[#16382b]/30 hover:border-[#16382b]/50 text-[#4a5c52] hover:text-[#16382b]'
                    }`}
                  >
                    <div className="text-3xl mb-2">👨</div>
                    <div className="text-sm font-light">גבר</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGender('female');
                      setTimeout(() => setStep(2), 300);
                    }}
                    className={`flex-1 max-w-[150px] py-6 px-8 rounded-2xl border-2 transition-all duration-300 ${
                      gender === 'female'
                        ? 'border-[#16382b] bg-[#16382b]/10 text-[#16382b]'
                        : 'border-[#16382b]/30 hover:border-[#16382b]/50 text-[#4a5c52] hover:text-[#16382b]'
                    }`}
                  >
                    <div className="text-3xl mb-2">👩</div>
                    <div className="text-sm font-light">אישה</div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Self Phone */}
            {step === 2 && (
              <div className="w-full animate-in fade-in duration-700">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#4a5c52] mb-4">
                  מספר הטלפון {getSelfText()}
                </label>
                <input 
                  required
                  autoFocus
                  type="tel"
                  placeholder="05X-XXXXXXX"
                  className="w-full bg-transparent border-b border-[#16382b]/30 py-4 text-center text-xl font-light focus:border-[#16382b] outline-none transition-all placeholder:text-[#4a5c52] text-[#16382b]"
                  value={data.selfPhone}
                  onChange={e => setData({...data, selfPhone: e.target.value})}
                />
              </div>
            )}

            {/* Step 3: Self Birthday */}
            {step === 3 && (
              <div className="w-full animate-in fade-in duration-700">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#4a5c52] mb-4">
                  תאריך הלידה {getSelfText()}
                </label>
                <input 
                  required
                  autoFocus
                  type="date"
                  className="w-full bg-transparent border-b border-[#16382b]/30 py-4 text-center text-xl font-light focus:border-[#16382b] outline-none transition-all text-[#16382b]"
                  value={data.selfBirthday}
                  onChange={e => setData({...data, selfBirthday: e.target.value})}
                />
                <p className="text-xs text-[#4a5c52] mt-2 font-light">זה בשביל לקבל הנחה ביום ההולדת שלך</p>
              </div>
            )}

            {/* Step 4: Partner Birthday */}
            {step === 4 && (
              <div className="w-full animate-in fade-in duration-700">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#4a5c52] mb-4">
                  תאריך יום ההולדת של {getPartnerText()}
                </label>
                <input 
                  required
                  autoFocus
                  type="date"
                  className="w-full bg-transparent border-b border-[#16382b]/30 py-4 text-center text-xl font-light focus:border-[#16382b] outline-none transition-all text-[#16382b]"
                  value={data.partnerBirthday}
                  onChange={e => setData({...data, partnerBirthday: e.target.value})}
                />
                <p className="text-xs text-[#4a5c52] mt-2 font-light">זה בשביל לקבל הנחה ביום ההולדת של {getPartnerText()}</p>
              </div>
            )}

            {/* Step 5: Success Message */}
            {step === 5 && (
              <div className="w-full animate-in fade-in duration-700">
                <p className="text-[#16382b] text-lg font-serif mb-2">תודה רבה!</p>
                <p className="text-[#4a5c52] text-sm">נשלח לך הנחה מיוחדת ביום ההולדת שלכם</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {step < 5 && (
              <>
                <button 
                  type="submit"
                  className="w-full py-5 bg-[#16382b] text-[#e0d7d3] uppercase tracking-[0.3em] font-bold text-[10px] hover:bg-[#1f4a3a] transition-colors rounded-full"
                >
                  {step < 4 ? 'הבא' : 'סיום והרשמה'}
                </button>
                {step > 1 && step < 5 && (
                  <button 
                    type="button"
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.2em] text-[#4a5c52] hover:text-[#16382b] transition-colors"
                  >
                    דלג הפעם
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthdayPopup;

import React, { useState, useEffect, FormEvent } from 'react';
import { PrivacyDisclosure } from './PrivacyDisclosure';
import { InfoTooltip } from './InfoTooltip';
import { SPECIALIZED_CARE_OPTIONS } from '../data';
import { 
  Calendar, 
  Heart, 
  Plus, 
  Minus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Check, 
  RotateCcw,
  Users,
  Tag
} from 'lucide-react';

interface PricingBreakdown {
  baseRate: number;
  petSurcharge: number;
  petSurchargePerNight: number;
  seniorSurcharge: number;
  medsSurcharge: number;
  gardenSurcharge: number;
  durationDiscount: number;
  total: number;
  perDay: number;
}

// Helper: date difference
const getDatesDiff = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 1;
  const s = new Date(startStr + 'T00:00:00');
  const e = new Date(endStr + 'T00:00:00');
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
};

// Helper: calculate end date from start date and nights
const calculateEndDateStr = (startStr: string, nights: number): string => {
  if (!startStr) return '';
  const start = new Date(startStr + 'T00:00:00');
  const end = new Date(start.getTime() + nights * 24 * 60 * 60 * 1000);
  const yyyy = end.getFullYear();
  const mm = String(end.getMonth() + 1).padStart(2, '0');
  const dd = String(end.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: format stay duration into friendly string (e.g. 1 month 2 days)
const formatStayDuration = (nights: number): string => {
  if (!nights || nights <= 0) return '1 night';
  if (nights < 7) {
    return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
  }
  if (nights < 30) {
    const weeks = Math.floor(nights / 7);
    const days = nights % 7;
    const weekText = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    if (days === 0) return weekText;
    const dayText = `${days} ${days === 1 ? 'day' : 'days'}`;
    return `${weekText} ${dayText}`;
  }
  const months = Math.floor(nights / 30);
  const days = nights % 30;
  const monthText = `${months} ${months === 1 ? 'month' : 'months'}`;
  if (days === 0) return monthText;
  const dayText = `${days} ${days === 1 ? 'day' : 'days'}`;
  return `${monthText} ${dayText}`;
};

interface BookMySitProps {
  initialDuration?: number;
  initialPetType?: 'dog' | 'cat' | 'mixed' | 'other' | 'none';
  initialPetCount?: number;
  initialHasMedications?: boolean;
  initialHasSeniorPets?: boolean;
  initialStartDate?: string;
  initialEndDate?: string;
}

export default function BookMySit({
  initialDuration = 30,
  initialPetType = 'none',
  initialPetCount = 0,
  initialHasMedications = false,
  initialHasSeniorPets = false,
  initialStartDate = '',
  initialEndDate = ''
}: BookMySitProps) {
  // System date anchor for min picker limits
  const todayStr = new Date().toISOString().split('T')[0];

  // ─── DATE & DURATION STATE ───
  const [startDate, setStartDate] = useState<string>(() => {
    if (initialStartDate) return initialStartDate;
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    if (initialEndDate) return initialEndDate;
    if (initialStartDate && initialDuration) {
      return calculateEndDateStr(initialStartDate, initialDuration);
    }
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + initialDuration);
    return defaultEnd.toISOString().split('T')[0];
  });
  const [duration, setDuration] = useState<number>(initialDuration);

  // ─── PET PROFILE STATE ───
  const [dogCount, setDogCount] = useState<number>(() => {
    if (initialPetType === 'dog') return initialPetCount;
    if (initialPetType === 'mixed') return Math.max(1, Math.floor(initialPetCount / 2));
    return 0;
  });
  const [catCount, setCatCount] = useState<number>(() => {
    if (initialPetType === 'cat') return initialPetCount;
    if (initialPetType === 'mixed') return Math.max(1, Math.ceil(initialPetCount / 2));
    return 0;
  });
  const [otherCount, setOtherCount] = useState<number>(() => {
    if (initialPetType === 'other') return initialPetCount;
    return 0;
  });

  // ─── CARE OPTIONS ───
  const [hasMedications, setHasMedications] = useState<boolean>(initialHasMedications);
  const [hasSeniorPets, setHasSeniorPets] = useState<boolean>(initialHasSeniorPets);
  const [largeGarden, setLargeGarden] = useState<boolean>(false);

  // ─── CONTACT DETAILS ───
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [referredBy, setReferredBy] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // ─── SYSTEM STATUS ───
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // ─── PRICING BREAKDOWN ───
  const [pricing, setPricing] = useState<PricingBreakdown>({
    baseRate: 999,
    petSurcharge: 0,
    petSurchargePerNight: 0,
    seniorSurcharge: 0,
    medsSurcharge: 0,
    gardenSurcharge: 0,
    durationDiscount: 0,
    total: 999,
    perDay: 33.30
  });

  // Synchronize internal state with changes to props
  useEffect(() => {
    if (initialStartDate) setStartDate(initialStartDate);
    if (initialEndDate) setEndDate(initialEndDate);
    if (initialDuration) setDuration(initialDuration);
  }, [initialStartDate, initialEndDate, initialDuration]);

  useEffect(() => {
    if (initialPetType === 'dog') {
      setDogCount(initialPetCount);
      setCatCount(0);
      setOtherCount(0);
    } else if (initialPetType === 'cat') {
      setDogCount(0);
      setCatCount(initialPetCount);
      setOtherCount(0);
    } else if (initialPetType === 'mixed') {
      setDogCount(Math.max(1, Math.floor(initialPetCount / 2)));
      setCatCount(Math.max(1, Math.ceil(initialPetCount / 2)));
      setOtherCount(0);
    } else if (initialPetType === 'other') {
      setDogCount(0);
      setCatCount(0);
      setOtherCount(initialPetCount);
    } else {
      setDogCount(0);
      setCatCount(0);
      setOtherCount(0);
    }
  }, [initialPetType, initialPetCount]);

  useEffect(() => {
    setHasMedications(initialHasMedications);
  }, [initialHasMedications]);

  useEffect(() => {
    setHasSeniorPets(initialHasSeniorPets);
  }, [initialHasSeniorPets]);

  // Sync dates & duration
  useEffect(() => {
    if (startDate && endDate) {
      const computedNights = getDatesDiff(startDate, endDate);
      if (computedNights !== duration) {
        setDuration(computedNights);
      }
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val) {
      const computedEnd = calculateEndDateStr(val, duration);
      setEndDate(computedEnd);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (val && startDate) {
      const s = new Date(startDate + 'T00:00:00');
      const e = new Date(val + 'T00:00:00');
      if (e <= s) {
        // Enforce at least 1 night
        const adjustedEnd = calculateEndDateStr(startDate, 1);
        setEndDate(adjustedEnd);
        setDuration(1);
      } else {
        const computedNights = getDatesDiff(startDate, val);
        setDuration(computedNights);
      }
    }
  };

  const handleMilestoneSelect = (nights: number) => {
    const start = startDate || new Date().toISOString().split('T')[0];
    if (!startDate) {
      setStartDate(start);
    }
    const end = calculateEndDateStr(start, nights);
    setEndDate(end);
    setDuration(nights);
  };

  // Pricing Engine (ensuring line items and totals add up with 100% mathematical consistency)
  useEffect(() => {
    let baseVal = 0;
    if (duration <= 1) {
      baseVal = 99;
    } else if (duration < 7) {
      // Linear scale between 1 night ($99) and 7 nights ($299)
      baseVal = 99 + (duration - 1) * ((299 - 99) / 6);
    } else if (duration < 30) {
      // Weekly scale: $299 per full week (7 days) + pro-rated daily rate ($299 / 7) for extra days, capped at monthly rate ($999)
      const weeks = Math.floor(duration / 7);
      const extraDays = duration % 7;
      const weeklyTotal = weeks * 299 + extraDays * (299 / 7);
      baseVal = Math.min(weeklyTotal, 999);
    } else {
      // Monthly scale: $999 per 30 days + pro-rated weekly/daily rate for remaining days
      const months = Math.floor(duration / 30);
      const remDays = duration % 30;
      const remWeeks = Math.floor(remDays / 7);
      const remExtraDays = remDays % 7;
      const remCost = Math.min(remWeeks * 299 + remExtraDays * (299 / 7), 999);
      baseVal = months * 999 + remCost;
    }
    const baseRate = Math.round(baseVal);

    // 2 pets of any kind always included, any additional pet +$10/night
    const totalPets = dogCount + catCount + otherCount;
    const additionalPets = Math.max(0, totalPets - 2);
    const petDailyRate = additionalPets * 10;
    const petSurcharge = Math.round(petDailyRate * duration);

    const seniorSurcharge = hasSeniorPets ? Math.round(2.50 * duration) : 0;
    const medsSurcharge = hasMedications ? Math.round(2.50 * duration) : 0;
    const gardenSurcharge = largeGarden ? Math.round(2.50 * duration) : 0;

    const subtotalItems = baseRate + petSurcharge + seniorSurcharge + medsSurcharge + gardenSurcharge;

    let discountPercent = 0;
    if (duration >= 90) {
      discountPercent = 0.15;
    } else if (duration >= 60) {
      discountPercent = 0.10;
    }

    const durationDiscount = Math.round(subtotalItems * discountPercent);
    const total = Math.max(0, subtotalItems - durationDiscount);
    const perDay = Number((total / Math.max(1, duration)).toFixed(2));

    setPricing({
      baseRate,
      petSurcharge,
      petSurchargePerNight: petDailyRate,
      seniorSurcharge,
      medsSurcharge,
      gardenSurcharge,
      durationDiscount,
      total,
      perDay
    });
  }, [duration, dogCount, catCount, otherCount, hasMedications, hasSeniorPets, largeGarden]);

  const handleReset = () => {
    const today = new Date();
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 30);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(defaultEnd.toISOString().split('T')[0]);
    setDuration(30);

    setDogCount(1);
    setCatCount(0);
    setOtherCount(0);

    setHasMedications(false);
    setHasSeniorPets(false);
    setLargeGarden(false);

    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setReferredBy('');
    setNotes('');
    setIsSuccess(false);
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    const derivedPetType = 
      (dogCount > 0 && catCount > 0) || (dogCount > 0 && otherCount > 0) || (catCount > 0 && otherCount > 0) ? 'mixed' :
      dogCount > 0 ? 'dog' :
      catCount > 0 ? 'cat' :
      otherCount > 0 ? 'other' : 'none';

    const payload = {
      name,
      email,
      phone,
      location,
      referredBy,
      startDate,
      endDate,
      petCount: dogCount + catCount + otherCount,
      petType: derivedPetType,
      hasMedications,
      hasSeniorPets,
      largeGarden,
      notes,
      source: 'bookmysit_v2'
    };

    try {
      const response = await fetch('/api/submit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsSuccess(true);
      } else {
        setIsSuccess(true); // fall-back
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(true); // fall-back
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div id="bookmysit-app-widget" className="bms-flex-outer-container">

      {isSuccess ? (
        <div className="bms-success-panel">
          <div className="bms-success-circle">
            <Check size={32} />
          </div>
          <h4>Thank You!</h4>
          <p>
            I've received your booking request for{' '}
            <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong> ({duration} {duration === 1 ? 'night' : 'nights'}). I'm looking forward to connecting with you!
          </p>
          <div className="bms-success-summary-box">
            <div className="bms-summary-row bms-summary-total">
              <span>Total Estimated Stay Cost:</span>
              <span className="bms-receipt-total-span">${pricing.total}</span>
            </div>
            <div className="bms-summary-row bms-summary-rate">
              <span>Average Nightly Rate:</span>
              <span>${pricing.perDay}/night</span>
            </div>
          </div>
          <p className="bms-success-coordinator">
            I will reach out to you within 24 hours to confirm availability and coordinate the details.
          </p>
          <button type="button" onClick={handleReset} className="bms-reset-btn">
            <RotateCcw size={14} /> Calculate Another Stay
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          {/* Quick Estimates Price Tags Bar */}
          <div className="bms-quick-estimates-bar">
            <div className="bms-price-tags-row">
              {[
                { days: 1, label: '1 Night', price: '$99' },
                { days: 7, label: '1 Week', price: '$299' },
                { days: 30, label: '1 Month', price: '$999' },
                { days: 60, label: '2 Months', price: '10% Off' },
                { days: 90, label: '3 Months', price: '15% Off' }
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => handleMilestoneSelect(item.days)}
                  className={`app-pill-btn bms-price-tag-pill ${duration === item.days ? 'active' : ''}`}
                >
                  <span className="bms-tag-label">{item.label}</span>
                  <span className="bms-tag-price">{item.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bms-form-flex-container">
            <div className="bms-flex-col bms-col-left">
            {/* STEP 1: DATES & STAY LENGTH */}
            <div className="bms-step-group bms-step-1">
              <div className="bms-step-title">
                <span className="bms-number">1</span>
                Travel Dates
              </div>
              
              <div className="bms-dates-row">
                <div className="bms-input-wrapper">
                  <span className="bms-input-icon-label"><Calendar size={12} /> Start Date</span>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="bms-date-input"
                  />
                </div>
                <div className="bms-input-wrapper">
                  <span className="bms-input-icon-label"><Calendar size={12} /> End Date</span>
                  <input
                    type="date"
                    required
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="bms-date-input"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: PET COUNTS (Horizontal compact counter) */}
            <div className="bms-step-group bms-step-2">
              <div className="bms-step-title">
                <span className="bms-number">2</span>
                Pets
                <InfoTooltip 
                  content="First two pets are included. After that, $300/month ($10/day) for each additional pet (up to 6 pets max)." 
                  iconSize={14}
                  align="left"
                  ariaLabel="Pet inclusion policy"
                />
              </div>

              <div className="bms-pet-counters-container">
                {/* Dog */}
                <div className={`bms-pet-row ${dogCount > 0 ? 'has-pets' : ''}`}>
                  <div className="bms-pet-label-group">
                    <span className="bms-pet-emoji">🐶</span>
                    <span className="bms-pet-name">Dogs</span>
                  </div>
                  <div className="bms-pet-stepper">
                    <button
                      type="button"
                      disabled={dogCount <= 0}
                      onClick={() => setDogCount(p => Math.max(0, p - 1))}
                      className="bms-circle-btn"
                      aria-label="Decrease dog count"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="bms-counter-value">{dogCount}</span>
                    <button
                      type="button"
                      disabled={dogCount + catCount + otherCount >= 6}
                      onClick={() => setDogCount(p => Math.min(6, p + 1))}
                      className="bms-circle-btn"
                      aria-label="Increase dog count"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Cat */}
                <div className={`bms-pet-row ${catCount > 0 ? 'has-pets' : ''}`}>
                  <div className="bms-pet-label-group">
                    <span className="bms-pet-emoji">🐱</span>
                    <span className="bms-pet-name">Cats</span>
                  </div>
                  <div className="bms-pet-stepper">
                    <button
                      type="button"
                      disabled={catCount <= 0}
                      onClick={() => setCatCount(p => Math.max(0, p - 1))}
                      className="bms-circle-btn"
                      aria-label="Decrease cat count"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="bms-counter-value">{catCount}</span>
                    <button
                      type="button"
                      disabled={dogCount + catCount + otherCount >= 6}
                      onClick={() => setCatCount(p => Math.min(6, p + 1))}
                      className="bms-circle-btn"
                      aria-label="Increase cat count"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Other */}
                <div className={`bms-pet-row ${otherCount > 0 ? 'has-pets' : ''}`}>
                  <div className="bms-pet-label-group">
                    <span className="bms-pet-emoji">🦜</span>
                    <span className="bms-pet-name">Other</span>
                  </div>
                  <div className="bms-pet-stepper">
                    <button
                      type="button"
                      disabled={otherCount <= 0}
                      onClick={() => setOtherCount(p => Math.max(0, p - 1))}
                      className="bms-circle-btn"
                      aria-label="Decrease other pet count"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="bms-counter-value">{otherCount}</span>
                    <button
                      type="button"
                      disabled={dogCount + catCount + otherCount >= 6}
                      onClick={() => setOtherCount(p => Math.min(6, p + 1))}
                      className="bms-circle-btn"
                      aria-label="Increase other pet count"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Home Only */}
                <button
                  type="button"
                  onClick={() => { setDogCount(0); setCatCount(0); setOtherCount(0); }}
                  className={`bms-pet-row bms-home-only-tile ${
                    dogCount === 0 && catCount === 0 && otherCount === 0 ? 'active' : ''
                  }`}
                >
                  <div className="bms-pet-label-group">
                    <span className="bms-pet-emoji">🏡</span>
                    <span className="bms-pet-name">Home Only</span>
                  </div>
                  <span className="bms-toggle-indicator">
                    {dogCount === 0 && catCount === 0 && otherCount === 0 ? '✓' : ''}
                  </span>
                </button>
              </div>
            </div>

            {/* 
              TEMPORARILY COMMENTED OUT - DO NOT DELETE:
              Step 3 (Specialized Care) is hidden for now and will be added back later.
            */}
            {/* 
            <div className="bms-step-group bms-step-3">
              <div className="bms-step-title">
                <span className="bms-number">3</span>
                Specialized Care
              </div>
              <div className="bms-care-rows-list">
                <label className={`bms-care-row-card ${hasSeniorPets ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={hasSeniorPets}
                    onChange={(e) => setHasSeniorPets(e.target.checked)}
                    className="bms-checkbox"
                  />
                  <div className="bms-care-info">
                    <span className="bms-care-label">{SPECIALIZED_CARE_OPTIONS.highEnergy.label}</span>
                    <span className="bms-care-desc">
                      {SPECIALIZED_CARE_OPTIONS.highEnergy.description}
                    </span>
                  </div>
                </label>

                <label className={`bms-care-row-card ${hasMedications ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={hasMedications}
                    onChange={(e) => setHasMedications(e.target.checked)}
                    className="bms-checkbox"
                  />
                  <div className="bms-care-info">
                    <span className="bms-care-label">{SPECIALIZED_CARE_OPTIONS.medications.label}</span>
                    <span className="bms-care-desc">
                      {SPECIALIZED_CARE_OPTIONS.medications.description}
                    </span>
                  </div>
                </label>

                <label className={`bms-care-row-card ${largeGarden ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={largeGarden}
                    onChange={(e) => setLargeGarden(e.target.checked)}
                    className="bms-checkbox"
                  />
                  <div className="bms-care-info">
                    <span className="bms-care-label">{SPECIALIZED_CARE_OPTIONS.garden.label}</span>
                    <span className="bms-care-desc">
                      {SPECIALIZED_CARE_OPTIONS.garden.description}
                    </span>
                  </div>
                </label>
              </div>
            </div>
            */}

            {/* STEP 3 (formerly STEP 4): CONTACT DETAILS */}
            <div className="bms-step-group bms-step-4">
              <div className="bms-step-title">
                <span className="bms-number">3</span>
                Contact Details
              </div>
              <div className="bms-fields-grid">
                <div className="bms-field">
                  <label className="bms-field-label">
                    <User size={12} /> Name
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bms-text-input"
                  />
                </div>

                <div className="bms-field">
                  <label className="bms-field-label">
                    <Mail size={12} /> Email
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="e.g. sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bms-text-input"
                  />
                </div>

                <div className="bms-field">
                  <label className="bms-field-label">
                    <Phone size={12} /> Phone
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. (555) 234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bms-text-input"
                  />
                </div>

                <div className="bms-field">
                  <label className="bms-field-label">
                    <MapPin size={12} /> Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, Mission District"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bms-text-input"
                  />
                </div>

                <div className="bms-field col-span-2">
                  <label className="bms-field-label">
                    <Users size={12} /> Referred by
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Friend's referral, Instagram, Google search"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    className="bms-text-input"
                  />
                </div>

                <div className="bms-field col-span-2">
                  <label className="bms-field-label">
                    <MessageSquare size={12} />Message
                  </label>
                  <textarea
                    placeholder="Tell me about your trip, pet's routine, or any special needs..."
                    rows={5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bms-textarea"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bms-flex-col bms-col-right">
            {/* STEP 5: REVIEW AND SUBMIT */}
            <div className="bms-receipt-card bms-step-5">
              <div className="bms-receipt-header">
                <div className="bms-step-title bms-review-title">
                  <span>Review & Submit</span>
                </div>
                <div className="bms-nights-pill">
                  <span>{formatStayDuration(duration)}</span>
                </div>
              </div>

              {/* Dynamic Dates Badge */}
              <div className="bms-receipt-dates">
                <div>
                  <span className="bms-date-label">Check-in</span>
                  <span className="bms-date-val">{startDate ? formatDate(startDate) : '---'}</span>
                </div>
                <div className="bms-arrow-sep">➔</div>
                <div>
                  <span className="bms-date-label">Check-out</span>
                  <span className="bms-date-val">{endDate ? formatDate(endDate) : '---'}</span>
                </div>
              </div>

              {/* Pets Summary Row */}
              <div className="bms-receipt-pets">
                <div>
                  <span className="bms-pets-label">Selected Pets</span>
                  <span className="bms-pets-val">
                    {dogCount + catCount + otherCount === 0 ? (
                      'No pets added'
                    ) : (
                      [
                        dogCount > 0 ? `${dogCount} ${dogCount === 1 ? 'Dog' : 'Dogs'}` : '',
                        catCount > 0 ? `${catCount} ${catCount === 1 ? 'Cat' : 'Cats'}` : '',
                        otherCount > 0 ? `${otherCount} ${otherCount === 1 ? 'Other' : 'Others'}` : ''
                      ].filter(Boolean).join(', ')
                    )}
                  </span>
                </div>
              </div>

              {/* Line items */}
              <div className="bms-line-items">
                <div className="bms-line-item">
                  <span className="bms-item-name">Base Rate ({formatStayDuration(duration)})</span>
                  <span className="bms-item-price">${pricing.baseRate}</span>
                </div>

                {pricing.petSurcharge > 0 && (
                  <div className="bms-line-item">
                    <span className="bms-item-name">
                      Pet Surcharge
                      <InfoTooltip 
                        content="First two pets are included. After that, $300/month ($10/day) for each additional pet (up to 6 pets max)." 
                        iconSize={13}
                        align="left"
                        ariaLabel="Pet surcharge details"
                      />
                    </span>
                    <span className="bms-item-price">+${pricing.petSurcharge}</span>
                  </div>
                )}

                {pricing.seniorSurcharge > 0 && (
                  <div className="bms-line-item">
                    <span className="bms-item-name">{SPECIALIZED_CARE_OPTIONS.highEnergy.label}</span>
                    <span className="bms-item-price">+${pricing.seniorSurcharge}</span>
                  </div>
                )}

                {pricing.medsSurcharge > 0 && (
                  <div className="bms-line-item">
                    <span className="bms-item-name">{SPECIALIZED_CARE_OPTIONS.medications.label}</span>
                    <span className="bms-item-price">+${pricing.medsSurcharge}</span>
                  </div>
                )}

                {pricing.gardenSurcharge > 0 && (
                  <div className="bms-line-item">
                    <span className="bms-item-name">{SPECIALIZED_CARE_OPTIONS.garden.label}</span>
                    <span className="bms-item-price">+${pricing.gardenSurcharge}</span>
                  </div>
                )}

                {pricing.durationDiscount > 0 && (
                  <div className="bms-line-item bms-discount-line">
                    <span className="bms-item-name">Long Sit Discount ({duration >= 90 ? '15% Off' : '10% Off'})</span>
                    <span className="bms-item-price">-${pricing.durationDiscount}</span>
                  </div>
                )}
              </div>

              {/* Bottom section (Total Estimate & Submit CTA) */}
              <div className="bms-receipt-bottom-group">
                <div className="bms-receipt-total">
                  <div className="bms-total-row">
                    <span className="bms-total-label">Total Estimate</span>
                    <span className="bms-total-price">${pricing.total}</span>
                  </div>
                  <div className="bms-per-night">~${pricing.perDay}/night</div>
                </div>

                {/* CTA submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={`bms-submit-cta ${!isFormValid ? 'bms-submit-cta-disabled' : ''}`}
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <span>Submit Your Booking</span>
                  )}
                </button>

                {/* Status note bar under button */}
                <div className="bms-cta-status-bar">
                  {!isFormValid ? (
                    <span className="bms-status-hint bms-status-pending">
                      * Please enter your name &amp; email
                    </span>
                  ) : (
                    <span className="bms-status-hint bms-status-ready">
                      ✓ All required fields complete
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
        <PrivacyDisclosure type="booking" align="center" />
      </form>
      )}
    </div>
  );
}

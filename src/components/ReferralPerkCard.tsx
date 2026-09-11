import React from 'react';
import { Gift } from 'lucide-react';

interface ReferralPerkCardProps {
  id?: string;
  className?: string;
}

export default function ReferralPerkCard({
  id = 'bms-referral-perk-card',
  className = '',
}: ReferralPerkCardProps) {
  return (
    <aside className={`bms-referral-card ${className}`.trim()} id={id} aria-label="Referral Program Perk">
      <div className="bms-referral-icon-wrap" aria-hidden="true">
        <Gift size={22} />
      </div>
      <div className="bms-referral-content">
        <div className="bms-referral-header">
          <span className="bms-referral-badge">Referral Perk</span>
          <h4 className="bms-referral-title">
            Recommend your trusted friend or neighbor and your next sit is on me!
          </h4>
        </div>
        <p className="bms-referral-text">
          Know someone who travels or needs trusted live-in care? When you recommend a trusted friend
          or neighbor and they complete a booked stay with me, your next sit is complimentary!
        </p>
        <span className="bms-referral-disclaimer">Subject to calendar availability.</span>
      </div>
    </aside>
  );
}

import React from 'react';
import { BookingRequest } from '../types';
import { formatHumanDate } from '../utils/calendarUtils';
import { formatBookingDuration, formatPetTypeLabel } from '../utils/formatUtils';
import { SPECIALIZED_CARE_OPTIONS } from '../data';
import { Check, RotateCcw, Sparkles, Info } from 'lucide-react';
import ReferralPerkCard from './ReferralPerkCard';

interface BookingConfirmationProps {
  booking: BookingRequest;
  onReset: () => void;
}

export function BookingConfirmation({ booking, onReset }: BookingConfirmationProps) {
  const clientFirstName = booking.name ? booking.name.trim().split(' ')[0] : 'there';
  const petTypeLabel = formatPetTypeLabel(booking);
  const durationStr = formatBookingDuration(booking);
  const p = booking.pricing;

  const specialCareItems: string[] = [];
  if (booking.hasSeniorPets) specialCareItems.push(SPECIALIZED_CARE_OPTIONS.highEnergy.label);
  if (booking.hasMedications) specialCareItems.push(SPECIALIZED_CARE_OPTIONS.medications.label);
  if (booking.largeGarden) specialCareItems.push(SPECIALIZED_CARE_OPTIONS.garden.label);

  const startHuman = booking.startDate ? formatHumanDate(booking.startDate) : '';
  const endHuman = booking.endDate ? formatHumanDate(booking.endDate) : '';

  return (
    <div className="bms-success-panel" role="region" aria-label="Booking Request Confirmation">
      {/* Success Icon */}
      <div className="bms-success-circle">
        <Check size={32} />
      </div>

      {/* Header & Warm Intro Pledge */}
      <h4 className="bms-success-title">Thank You for Your Request!</h4>
      <p className="bms-success-subtitle">
        Thank you, {clientFirstName}! Your booking request has been received. A confirmation copy has been sent to your email.
      </p>

      {/* What Happens Next Note - right under intro subtitle matching email */}
      <div className="bms-confirmation-next-steps">
        🕒 <strong>What happens next:</strong> I will review my calendar and reach out to you directly within 24 hours to confirm availability and coordinate details.
      </div>

      {/* Standardized Cards Container */}
      <div className="bms-confirmation-wrapper">
        {/* Friend & Neighbor Referral Reward Banner */}
        <ReferralPerkCard id="bms-confirm-referral-perk" />

        {/* Stay & Care Details Card */}
        <div className="bms-confirmation-card">
          <h5 className="bms-confirmation-card-title">Stay &amp; Care Details</h5>
          <div className="bms-confirmation-table">
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Start Date:</span>
              <span className="bms-confirmation-value">{startHuman}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">End Date:</span>
              <span className="bms-confirmation-value">{endHuman}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Duration:</span>
              <span className="bms-confirmation-value">{durationStr}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Pets:</span>
              <span className="bms-confirmation-value">{petTypeLabel}</span>
            </div>
            {/* Special Care row commented out for now as feature is hidden in UI
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Special Care:</span>
              <span className="bms-confirmation-value">
                {specialCareItems.length > 0 ? (
                  <span className="bms-confirmation-badge-list">
                    {specialCareItems.map((item, idx) => (
                      <span key={idx} className="bms-confirmation-badge-item">• {item}</span>
                    ))}
                  </span>
                ) : (
                  <span className="bms-confirmation-subval">Standard Care (No special requirements)</span>
                )}
              </span>
            </div>
            */}
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bms-confirmation-card">
          <h5 className="bms-confirmation-card-title">Contact Details</h5>
          <div className="bms-confirmation-table">
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Name:</span>
              <span className="bms-confirmation-value">{booking.name || ''}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Email:</span>
              <span className="bms-confirmation-value">{booking.email || ''}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Phone:</span>
              <span className="bms-confirmation-value">{booking.phone || ''}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Location / Area:</span>
              <span className="bms-confirmation-value">{booking.location || ''}</span>
            </div>
            {booking.isRepeatClient && (
              <div className="bms-confirmation-row">
                <span className="bms-confirmation-label">Client Status:</span>
                <span className="bms-confirmation-value">
                  <span className="bms-confirmation-badge-pill">
                    <Sparkles size={11} className="bms-inline-icon" />
                    Repeat Client (10% Discount Applied)
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes Card (if provided) */}
        {booking.notes && booking.notes.trim() && (
          <div className="bms-confirmation-card">
            <h5 className="bms-confirmation-card-title">Notes</h5>
            <p className="bms-confirmation-notes-box">&ldquo;{booking.notes.trim()}&rdquo;</p>
          </div>
        )}

        {/* Estimated Pricing Breakdown Card */}
        {p && p.total !== undefined && (
          <div className="bms-confirmation-card">
            <h5 className="bms-confirmation-card-title">Estimated Pricing Breakdown</h5>
            <div className="bms-confirmation-table">
              {p.baseRate !== undefined && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">Base Rate ({durationStr}):</span>
                  <span className="bms-confirmation-value">${p.baseRate}</span>
                </div>
              )}

              {p.petSurcharge !== undefined && p.petSurcharge > 0 && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">Additional Pets Surcharge:</span>
                  <span className="bms-confirmation-value">+${p.petSurcharge}</span>
                </div>
              )}

              {p.seniorSurcharge !== undefined && p.seniorSurcharge > 0 && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">
                    {SPECIALIZED_CARE_OPTIONS.highEnergy.label}:
                  </span>
                  <span className="bms-confirmation-value">+${p.seniorSurcharge}</span>
                </div>
              )}

              {p.medsSurcharge !== undefined && p.medsSurcharge > 0 && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">
                    {SPECIALIZED_CARE_OPTIONS.medications.label}:
                  </span>
                  <span className="bms-confirmation-value">+${p.medsSurcharge}</span>
                </div>
              )}

              {p.gardenSurcharge !== undefined && p.gardenSurcharge > 0 && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">
                    {SPECIALIZED_CARE_OPTIONS.garden.label}:
                  </span>
                  <span className="bms-confirmation-value">+${p.gardenSurcharge}</span>
                </div>
              )}

              {p.durationDiscount !== undefined && p.durationDiscount > 0 && (
                <div className="bms-confirmation-row bms-confirmation-savings-row">
                  <span className="bms-confirmation-label">Long-Stay Savings:</span>
                  <span className="bms-confirmation-value">-${p.durationDiscount}</span>
                </div>
              )}

              {((p.repeatClientDiscount !== undefined && p.repeatClientDiscount > 0) || booking.isRepeatClient) && (
                <div className="bms-confirmation-row bms-confirmation-savings-row">
                  <span className="bms-confirmation-label">Repeat Client (10% Off):</span>
                  <span className="bms-confirmation-value">
                    {p.repeatClientDiscount && p.repeatClientDiscount > 0
                      ? `-$${p.repeatClientDiscount}`
                      : '10% Off'}
                  </span>
                </div>
              )}

              <div className="bms-confirmation-total-row">
                <span className="bms-confirmation-total-label">Total Estimated Cost</span>
                <span className="bms-confirmation-total-value">${p.total}</span>
              </div>

              {p.perDay !== undefined && (
                <div className="bms-confirmation-row bms-confirmation-rate-row">
                  <span className="bms-confirmation-label">Average Nightly Rate</span>
                  <span className="bms-confirmation-subval">
                    ~<span className="bms-confirmation-subval-amount">${p.perDay.toFixed(2)}</span>{' '}
                    / night
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Non-binding Estimate Notice */}
        <div className="bms-confirmation-estimate-card" id="bms-confirmation-estimate-notice">
          <Info size={16} className="bms-confirmation-estimate-icon" aria-hidden="true" />
          <div className="bms-confirmation-estimate-content">
            <strong>Estimate only:</strong> Final rates and booking are confirmed during our intro call.
          </div>
        </div>
      </div>

      {/* Calculate Another Stay CTA */}
      <button type="button" onClick={onReset} className="bms-reset-btn">
        <RotateCcw size={14} /> Calculate Another Stay
      </button>
    </div>
  );
}

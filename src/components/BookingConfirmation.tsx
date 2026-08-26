import React from 'react';
import { BookingRequest } from '../types';
import { formatHumanDate } from '../utils/calendarUtils';
import { formatBookingDuration, formatPetTypeLabel } from '../utils/bookingEmail';
import { SPECIALIZED_CARE_OPTIONS } from '../data';
import { Check, RotateCcw } from 'lucide-react';

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
        Thank you, {clientFirstName}! Your request has been received. I will review my schedule and get back to you within 24 hours.
      </p>

      {/* Standardized Cards Container */}
      <div className="bms-confirmation-wrapper">
        {/* Stay & Care Details Card */}
        <div className="bms-confirmation-card">
          <h5 className="bms-confirmation-card-title">Stay &amp; Care Details</h5>
          <div className="bms-confirmation-table">
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Start Date:</span>
              <span className="bms-confirmation-value">
                {startHuman} <span className="bms-confirmation-subval">({booking.startDate})</span>
              </span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">End Date:</span>
              <span className="bms-confirmation-value">
                {endHuman} <span className="bms-confirmation-subval">({booking.endDate})</span>
              </span>
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
              <span className="bms-confirmation-value">{booking.name || 'Not provided'}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Email:</span>
              <span className="bms-confirmation-value">{booking.email || 'Not provided'}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Phone:</span>
              <span className="bms-confirmation-value">{booking.phone || 'Not provided'}</span>
            </div>
            <div className="bms-confirmation-row">
              <span className="bms-confirmation-label">Location / Area:</span>
              <span className="bms-confirmation-value">{booking.location || 'Not provided'}</span>
            </div>
            {booking.referredBy && (
              <div className="bms-confirmation-row">
                <span className="bms-confirmation-label">Referred By:</span>
                <span className="bms-confirmation-value">{booking.referredBy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes Card (if provided) */}
        {booking.notes && booking.notes.trim() && (
          <div className="bms-confirmation-card">
            <h5 className="bms-confirmation-card-title">Notes</h5>
            <p className="bms-confirmation-notes-box">
              &ldquo;{booking.notes.trim()}&rdquo;
            </p>
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
                  <span className="bms-confirmation-label">{SPECIALIZED_CARE_OPTIONS.highEnergy.label}:</span>
                  <span className="bms-confirmation-value">+${p.seniorSurcharge}</span>
                </div>
              )}

              {p.medsSurcharge !== undefined && p.medsSurcharge > 0 && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">{SPECIALIZED_CARE_OPTIONS.medications.label}:</span>
                  <span className="bms-confirmation-value">+${p.medsSurcharge}</span>
                </div>
              )}

              {p.gardenSurcharge !== undefined && p.gardenSurcharge > 0 && (
                <div className="bms-confirmation-row">
                  <span className="bms-confirmation-label">{SPECIALIZED_CARE_OPTIONS.garden.label}:</span>
                  <span className="bms-confirmation-value">+${p.gardenSurcharge}</span>
                </div>
              )}

              {p.durationDiscount !== undefined && p.durationDiscount > 0 && (
                <div className="bms-confirmation-row bms-confirmation-savings-row">
                  <span className="bms-confirmation-label">Long-Stay Savings (10% Off):</span>
                  <span className="bms-confirmation-value">-${p.durationDiscount}</span>
                </div>
              )}

              <div className="bms-confirmation-total-row">
                <span className="bms-confirmation-total-label">Total Estimated Cost</span>
                <span className="bms-confirmation-total-value">${p.total}</span>
              </div>

              {p.perDay !== undefined && (
                <div className="bms-confirmation-row bms-confirmation-rate-row">
                  <span className="bms-confirmation-label">Average Nightly Rate</span>
                  <span className="bms-confirmation-subval">~${p.perDay.toFixed(2)} / night</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps Note */}
        <div className="bms-confirmation-next-steps">
          🕒 <strong>Next step:</strong> I will review my calendar and email or call you within 24 hours to confirm availability and coordinate details.
        </div>
      </div>

      {/* Calculate Another Stay CTA */}
      <button type="button" onClick={onReset} className="bms-reset-btn">
        <RotateCcw size={14} /> Calculate Another Stay
      </button>
    </div>
  );
}

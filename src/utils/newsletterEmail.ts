export function generateNewsletterEmailHtml(email: string, totalSubscribers?: number): string {
  return `
    <div style="font-family: sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #bc9c5d; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px;">New Newsletter Subscriber!</h2>
      <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">You have a new subscriber for your California availability and monthly updates:</p>
      <div style="font-size: 18px; font-weight: bold; background-color: #fcfaf7; color: #bc9c5d; padding: 12px 20px; border-radius: 6px; display: inline-block; border: 1px solid #f3ebd8; margin: 12px 0;">
        ${email}
      </div>
      ${
        typeof totalSubscribers === 'number'
          ? `<p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Total active local subscribers: <strong>${totalSubscribers}</strong></p>`
          : ''
      }
      <p style="font-size: 12px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
        This notification was automatically sent by your Home & Pet Sitter Web Portal.
      </p>
    </div>
  `;
}

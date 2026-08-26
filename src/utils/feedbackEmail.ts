export interface FeedbackPayload {
  message: string;
  category?: string;
  name?: string;
  email?: string;
  rating?: string;
}

export function generateFeedbackEmailHtml(feedback: FeedbackPayload): string {
  const categoryLabel = feedback.category || 'General Feedback';
  const nameLabel = feedback.name?.trim() ? feedback.name.trim() : 'Anonymous Visitor';
  const emailLabel = feedback.email?.trim() ? feedback.email.trim() : 'Not provided';
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; padding: 4px 12px; background-color: #f3ebd8; color: #b08c40; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 9999px; margin-bottom: 8px;">
          ${categoryLabel}
        </span>
        <h2 style="color: #1a1a1a; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">New Website Feedback & Thoughts</h2>
        <p style="color: #666666; font-size: 13px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Website</p>
      </div>

      <!-- Feedback Content Box -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
        <h3 style="margin-top: 0; color: #b08c40; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Message</h3>
        <p style="margin: 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap; font-style: normal; background-color: #fcfaf7; padding: 14px 16px; border-radius: 8px; border-left: 3px solid #b08c40;">
          ${feedback.message}
        </p>
      </div>

      <!-- Sender Details Card -->
      <div style="background-color: #ffffff; padding: 18px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 15px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 8px; margin-bottom: 12px;">Submitted By</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 5px 0; color: #666666; width: 130px; font-weight: 500;">Name:</td>
            <td style="padding: 5px 0; color: #1a1a1a; font-weight: 600;">${nameLabel}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Email:</td>
            <td style="padding: 5px 0; color: #1a1a1a;">
              ${feedback.email?.trim() ? `<a href="mailto:${feedback.email.trim()}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${feedback.email.trim()}</a>` : 'Not provided'}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Category:</td>
            <td style="padding: 5px 0; color: #1a1a1a; font-weight: 600;">${categoryLabel}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Submitted Time:</td>
            <td style="padding: 5px 0; color: #666666; font-size: 13px;">${submittedAt} (PT)</td>
          </tr>
        </table>
      </div>

      <!-- Quick Action Footer -->
      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #999999;">
        ${
          feedback.email?.trim()
            ? `To reply directly to this visitor, email <a href="mailto:${feedback.email.trim()}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${feedback.email.trim()}</a>.`
            : 'Submitted anonymously through the website feedback form.'
        }
      </div>
    </div>
  `;
}

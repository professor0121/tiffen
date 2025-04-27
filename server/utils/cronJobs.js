// utils/cronJobs.js
const cron = require('node-cron');
const db = require('./db');
const { sendEmail } = require('./email');

cron.schedule('0 9 * * *', async () => { // every day at 9am
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [subs] = await db.query(
    'SELECT s.id, s.user_id, u.email, u.name FROM subscriptions s JOIN users u ON s.user_id=u.id WHERE s.end_date = ?',
    [tomorrow]
  );

  for (const sub of subs) {
    const html = `
      <p>Hi ${sub.name},</p>
      <p>Your subscription (ID: ${sub.id}) will expire on <strong>${tomorrow}</strong>.</p>
      <p>Renew now to continue enjoying your meals without interruption!</p>
    `;
    sendEmail({ to: sub.email, subject: 'Subscription Expiry Reminder', html });
  }
});

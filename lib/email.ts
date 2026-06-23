import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await transporter.sendMail({
    from: `"Amoi Fashion" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your Amoi password',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;margin-bottom:24px;font-style:italic;">Amoi</h1>
        <p style="font-size:16px;color:#0a0a0a;margin-bottom:16px;">
          You requested a password reset. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
          style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:12px 32px;text-decoration:none;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px;">
          Reset Password
        </a>
        <p style="font-size:14px;color:#6b6b6b;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

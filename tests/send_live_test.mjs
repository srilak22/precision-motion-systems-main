// Live test email dispatch using Nodemailer Ethereal test provider
import nodemailer from "nodemailer";
import { renderWelcomeEmail } from "../api/_lib/email/templates/welcome.js";
import { BRAND } from "../api/_lib/email/constants.js";

async function main() {
  console.log("Generating Ethereal test account...");
  const testAccount = await nodemailer.createTestAccount();
  console.log("Ethereal test account created:", testAccount.user);

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const welcome = renderWelcomeEmail({
    email: "srilakshana.int2027g3@gmail.com",
    name: "Sri Lakshana",
    correlationId: `live_test_${Date.now()}`,
  });

  console.log("Sending email to srilakshana.int2027g3@gmail.com...");
  const info = await transporter.sendMail({
    from: `"${BRAND.fullName}" <${testAccount.user}>`,
    to: "srilakshana.int2027g3@gmail.com",
    subject: welcome.subject,
    html: welcome.html,
    text: welcome.text,
  });

  console.log("Message sent successfully!");
  console.log("Message ID:", info.messageId);
  console.log("Provider Response:", info.response);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("==================================================");
  console.log("LIVE PREVIEW URL:", previewUrl);
  console.log("==================================================");
}

main().catch(console.error);

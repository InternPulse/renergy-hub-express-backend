import nodemailer from "nodemailer";
import { EMAIL_ADDRESS } from "./secrets";
import { EMAIL_PASSWORD } from "./secrets";
// import { EMAIL_VERIFICATION_TEMPLATE } from "./email.templates";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // false for port 587 and other ports, true for port 465
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

async function sendForgotPasswordEmail(
  email: string,
  emailFirstName: string,
  token: string
) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Renergy Hub" <emmanuelarumona1990@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "Renergy Hub Forgot Password Reset Verification", // Subject line
    text: "", // plain text body
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Forgot Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Forgot Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello, ${emailFirstName}</p>
    <p>Your verification code is: <strong>${token}</strong></p>
    <p>Enter this code on the verification page to complete your forgot password verification.</p>
    <p>This code will expire in 1 hour for security reasons.</p>
    <p>If you didn't request for this, please ignore this email.</p>
    <p>Best regards,<br>Renergy Hub Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`, // html body
  });

  // console.log("Message sent: %s", info.messageId);
}

export default sendForgotPasswordEmail;

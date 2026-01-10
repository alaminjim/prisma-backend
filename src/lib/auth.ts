import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  //   qus.4
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // qus.5
      const verificationEmail = `${process.env.APP_URL}/verify-email?token=${token}`;

      const info = await transporter.sendMail({
        from: '"Prisma Blog App" <prismaApp@io.email>',
        to: user.email,
        subject: "Verify your email address",
        html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f4f6f8; padding:40px 0;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <tr>
            <td style="background:#111827;padding:20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;">Prisma Blog App</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px;color:#374151;">
              <h2 style="margin-top:0;">Verify your email</h2>
              <p style="font-size:15px;line-height:1.6;">
                Hi <strong>${user.name || "there"}</strong>,
                <br /><br />
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center;margin:35px 0;">
                <a href="${verificationEmail}"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:600;
                    display:inline-block;
                  ">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#6b7280;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px;word-break:break-all;">
                <a href="${verificationEmail}" style="color:#2563eb;">
                  ${verificationEmail}
                </a>
              </p>

              <p style="font-size:14px;color:#6b7280;margin-top:30px;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} Prisma Blog App. All rights reserved.
            </td>
          </tr>

        </table>
      </div>
      `,
      });

      console.log("Message sent:", info.messageId);
    },
  },
});

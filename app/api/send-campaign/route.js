import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
     from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html: `
        <div style="font-family: Inter, sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message}</p>
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
            Sent via Serven AI Marketing Engine
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
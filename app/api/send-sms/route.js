import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing phone number or message" },
        { status: 400 }
      );
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const msg = await client.messages.create({
  body: message,
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
  to,
});

    return NextResponse.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error("SMS failed:", err);
    return NextResponse.json(
      { error: err.message || "SMS failed" },
      { status: 500 }
    );
  }
}
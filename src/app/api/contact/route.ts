import { NextResponse } from 'next/server';
import { sendContactInquiryEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ success: false, error: 'A valid phone number is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter your message.' }, { status: 400 });
    }

    const emailResult = await sendContactInquiryEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: (subject || 'Book Inquiry').trim(),
      message: message.trim(),
    });

    if (!emailResult.success) {
      console.error('[contact-api] Email delivery failed:', emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Email delivery encountered an issue. Please connect directly via WhatsApp at +91 96066 36804.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been sent successfully to kannada@belesu.in. Our team will contact you shortly.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[contact-api] Server exception:', message);
    return NextResponse.json({ success: false, error: 'Server error processing your inquiry.' }, { status: 500 });
  }
}


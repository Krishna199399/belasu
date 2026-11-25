import { NextResponse } from 'next/server';
import { sendContactInquiryEmail } from '@/lib/email';
import { clientIp, hitRateLimit, tooManyRequests } from '@/lib/rateLimit';

const cap = (v: unknown, max: number): string | undefined => (typeof v === 'string' ? v.slice(0, max) : undefined);

export async function POST(req: Request) {
  try {
    // Every inquiry emails the team — stop spam floods
    const limit = hitRateLimit(`contact:${clientIp(req.headers)}`, 5, 60 * 60 * 1000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter, 'Too many messages. Please try again later or WhatsApp us on +91 96066 36804.');

    const raw = (await req.json()) || {};
    const body = {
      name: cap(raw.name, 100),
      email: cap(raw.email, 200),
      phone: cap(raw.phone, 20),
      subject: cap(raw.subject, 150),
      message: cap(raw.message, 5000),
    };
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


import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  inquiryType?: 'audience' | 'client';
  name?: string;
  email?: string;
  projectType?: string;
  topic?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  try {
    let body: ContactPayload;
    try {
      body = (await request.json()) as ContactPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { inquiryType, name, email, projectType, topic, message } = body;
    const resolvedInquiryType = inquiryType === 'client' ? 'client' : 'audience';

    if (!name || !email || !email.includes('@') || !message) {
      return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_CONTACT_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Form service is not configured.' }, { status: 500 });
    }

    const payload = {
      access_key: accessKey,
      subject:
        resolvedInquiryType === 'client'
          ? `New client inquiry from ${name}`
          : `New audience message from ${name}`,
      from_name: name,
      email,
      message: [
        `Inquiry type: ${resolvedInquiryType}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic || 'Not specified'}`,
        `Project type: ${projectType || 'Not specified'}`,
        '',
        message,
      ].join('\n'),
    };

    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const web3Data = (await web3Response.json()) as { success?: boolean; message?: string };

    if (!web3Response.ok || !web3Data.success) {
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks. Your message has been received.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

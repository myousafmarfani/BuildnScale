import { NextRequest, NextResponse } from 'next/server';

type ScheduleCallPayload = {
  date?: string;
  timezone?: string;
  time?: string;
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  try {
    let body: ScheduleCallPayload;
    try {
      body = (await request.json()) as ScheduleCallPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { date, timezone, time, name, email, projectType, message } = body;

    if (!date || !timezone || !time || !name || !email || !email.includes('@') || !message) {
      return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_SCHEDULECALL_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Schedule service is not configured.' }, { status: 500 });
    }

    const payload = {
      access_key: accessKey,
      subject: `New call schedule request from ${name}`,
      from_name: name,
      email,
      message: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Preferred date: ${date}`,
        `Timezone: ${timezone}`,
        `Preferred time: ${time}`,
        `Project type: ${projectType || 'Not specified'}`,
        '',
        `Agenda: ${message}`,
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
        { error: 'Failed to submit schedule request. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks. Your call request has been submitted.',
    });
  } catch (error) {
    console.error('Schedule call form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit schedule request. Please try again.' },
      { status: 500 }
    );
  }
}

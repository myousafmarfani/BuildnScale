import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string; roadmapTitle?: string };
    try {
      body = (await request.json()) as { email?: string; roadmapTitle?: string };
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { email, roadmapTitle } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_NOTIFYME_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Form service is not configured.' }, { status: 500 });
    }

    const payload = {
      access_key: accessKey,
      subject: `Roadmap Notify Request: ${roadmapTitle || 'Roadmap'}`,
      from_name: 'BuildnScale Roadmaps',
      email,
      message: `Please notify this email when ${roadmapTitle || 'the roadmap'} is live: ${email}`,
    };

    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const web3Data = (await web3Response.json()) as { success?: boolean; message?: string };

    if (!web3Response.ok || !web3Data.success) {
      return NextResponse.json(
        { error: 'Unable to submit your request right now. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks. You are on the launch notification list.',
    });
  } catch (error) {
    console.error('Roadmap notify submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

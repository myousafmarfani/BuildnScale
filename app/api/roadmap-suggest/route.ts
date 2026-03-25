import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let body: { name?: string; email?: string; topic?: string; message?: string };
    try {
      body = (await request.json()) as {
        name?: string;
        email?: string;
        topic?: string;
        message?: string;
      };
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { name, email, topic, message } = body;

    if (!name || !email || !topic) {
      return NextResponse.json({ error: 'Name, email, and topic are required.' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_ROADMAPTOPICSUGGESTED_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Form service is not configured.' }, { status: 500 });
    }

    const payload = {
      access_key: accessKey,
      subject: `Roadmap suggestion: ${topic}`,
      from_name: name,
      email,
      message: `Topic: ${topic}\nName: ${name}\nEmail: ${email}\n\n${message || 'No additional message provided.'}`,
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
      message: 'Thanks. We will notify you when your request is fulfilled.',
    });
  } catch (error) {
    console.error('Roadmap suggestion error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

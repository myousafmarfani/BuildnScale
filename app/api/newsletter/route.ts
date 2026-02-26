import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Here you would integrate with your newsletter service
    // Examples: Mailchimp, ConvertKit, SendGrid, etc.
    
    // For demo purposes, we'll just log it
    console.log('Newsletter subscription:', email);

    // Example: Mailchimp integration
    // const response = await fetch(
    //   `https://us21.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email_address: email,
    //       status: 'subscribed',
    //     }),
    //   }
    // );

    // Example: ConvertKit integration
    // const response = await fetch(
    //   `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       api_key: process.env.CONVERTKIT_API_KEY,
    //       email: email,
    //     }),
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error('Failed to subscribe');
    // }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

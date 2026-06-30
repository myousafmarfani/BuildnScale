import { NextResponse } from "next/server"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      )
    }

    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    })

    if (res.status === 201) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (res.status === 400 || res.status === 409) {
      let body
      try {
        body = await res.json()
      } catch {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 }
        )
      }

      if (body?.code === "subscriber_already_exists" || body?.code === "duplicate_subscriber") {
        return NextResponse.json(
          { success: true, alreadySubscribed: true },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

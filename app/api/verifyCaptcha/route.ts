import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { captchaResponse } = await req.json();
  console.log("reCAPTCHA response:", captchaResponse);

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaResponse,
        },
      }
    );
    console.log("reCAPTCHA response:", response.data);

    if (response.data.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid reCAPTCHA response" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to verify reCAPTCHA:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify reCAPTCHA" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 });
}

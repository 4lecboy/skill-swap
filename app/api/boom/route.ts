import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  try {
    throw new Error("Boom test error for Sentry");
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ ok: false, message: "Error captured" }, { status: 500 });
  }
}
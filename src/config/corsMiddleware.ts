import { NextRequest, NextResponse } from "next/server";

//this was for api calls but is not used anymore

// List of allowed origins
const allowedOrigins = [
  "https://metricsgarden.xyz",
  "http://localhost:3000",
  "https://module3-git-newschema-metrics-garden-labs.vercel.app",
];

// Define a type for the handler function
type Handler = (
  req: NextRequest,
  res: NextResponse
) => Promise<NextResponse | void>;

// Utility function to set headers on NextResponse
const setHeaders = (res: NextResponse, headers: { [key: string]: string }) => {
  Object.entries(headers).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
};

// Define the middleware function with appropriate types
export function corsMiddleware(handler: Handler): Handler {
  return async (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get("origin");

    const headers: { [key: string]: string } = {
      "Access-Control-Allow-Origin":
        origin && allowedOrigins.includes(origin) ? origin : "false",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    setHeaders(res, headers);

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: res.headers });
    }

    return handler(req, res);
  };
}

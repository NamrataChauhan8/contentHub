import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ user: null, message: "Unauthorized" }, { status: 401 });
  }

  const user = {
    id: token.sub ?? null,
    name: token.name ?? null,
    email: token.email ?? null,
    image: (token as any).picture ?? null,
  };

  return NextResponse.json({ user });
}



import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function withAuth(
  req: NextRequest,
  handler: (ctx: { req: NextRequest; userId: string }) => Promise<NextResponse>
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return handler({ req, userId: token.sub });
}

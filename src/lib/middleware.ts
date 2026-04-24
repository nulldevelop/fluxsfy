// Middleware simplificado para Better Auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

export default function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/dashboard-owner/:path*"],
};

import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import { cookies } from "next/headers";
import { verify, JwtPayload } from "jsonwebtoken";
import User from "@/database/schemas/User";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("showergladeCookie")?.value;

	if (!token) {
		return NextResponse.json({ user: null });
	}

	try {
		// Use verify instead of decode to ensure the token is valid and signed
		const decoded = verify(
			token,
			process.env.JWT_SECRET || "default_secret",
		) as JwtPayload;

		if (!decoded || !decoded.userId) {
			return NextResponse.json({ user: null });
		}

		await connectDB();
		const user = await User.findById(decoded.userId).select("-__v");

		if (!user) {
			return NextResponse.json({ user: null });
		}

		return NextResponse.json({ user });
	} catch (error) {
		console.error("Auth check error:", error);
		return NextResponse.json({ user: null }, { status: 500 });
	}
}

import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import { cookies } from "next/headers";
import { verify, JwtPayload } from "jsonwebtoken";
import User from "@/database/schemas/User";
import Slacklist from "@/database/schemas/Slacklist";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("showergladeCookie")?.value;

	if (!token) {
		return NextResponse.json({ user: null });
	}

	try {
		const decoded = verify(
			token,
			process.env.JWT_SECRET || "default_secret",
		) as JwtPayload;

		if (!decoded || !decoded.userId) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		await connectDB();
		const user = await User.findById(decoded.userId).select("-__v");

		if (!user) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		if (!user.slackId) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		const slacklistEntry = await Slacklist.findOne({
			slackId: user.slackId,
		});

		if (!slacklistEntry) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		return NextResponse.json({ user });
	} catch (error) {
		console.error("Auth check error:", error);
		return NextResponse.json({ user: null }, { status: 500 });
	}
}

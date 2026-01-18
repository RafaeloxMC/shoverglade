import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Slot from "@/database/schemas/Slot";

export async function GET() {
	try {
		await connectDB();

		const slots = await Slot.find({}).sort({ startTime: 1 });

		const formattedSlots = slots.map((slot) => ({
			_id: slot._id,
			startTime: slot.startTime,
			endTime: slot.endTime,
			isBooked: slot.isBooked,
			userId: slot.userId || null,
			bookedBy: slot.userId
				? {
						name: slot.userId.name,
						avatar: slot.userId.avatar,
					}
				: undefined,
		}));

		return NextResponse.json({ slots: formattedSlots });
	} catch (e) {
		console.error("Fetch slots error:", e);
		return NextResponse.json(
			{ error: "Failed to fetch slots" },
			{ status: 500 },
		);
	}
}

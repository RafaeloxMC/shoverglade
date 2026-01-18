import mongoose from "mongoose";

// MODELS HERE:
import "@/database/schemas/User";
import "@/database/schemas/Slot";
import "@/database/schemas/Session";

let conn: mongoose.Mongoose;

export async function connectDB() {
	if (!process.env.MONGO_URI) {
		throw Error("MONGO_URI not found in environment!");
	}
	if (!conn) conn = await mongoose.connect(process.env.MONGO_URI || "");
}

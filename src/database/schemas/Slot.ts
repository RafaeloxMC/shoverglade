import mongoose, { Model, model, Types } from "mongoose";

export interface ISlot {
	startTime: Date;
	endTime: Date;
	isBooked: boolean;
	userId: Types.ObjectId;
}

const slotSchema = new mongoose.Schema(
	{
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		isBooked: { type: Boolean, default: false },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true },
);

export default (mongoose.models["slot"] as Model<ISlot>) ||
	(model("slot", slotSchema) as Model<ISlot>);

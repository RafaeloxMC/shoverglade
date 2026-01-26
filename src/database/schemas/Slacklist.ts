import mongoose, { model, Model, Schema, SchemaTypes } from "mongoose";

export interface ISlacklist {
	slackId: string;
}

const slacklistSchema = new Schema({
	slackId: SchemaTypes.String,
});

export default (mongoose.models["slacklist"] as Model<ISlacklist>) ||
	(model("slacklist", slacklistSchema) as Model<ISlacklist>);

import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const RecordSchema = new Schema({}, { timestamps: true });

export const Record = model("Record", RecordSchema);

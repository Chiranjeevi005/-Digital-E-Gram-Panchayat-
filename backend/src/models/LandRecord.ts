import mongoose, { Document, Schema } from 'mongoose';

export interface ILandRecord extends Document {
  surveyNo: string;
  owner: string;
  area: string;
  landType: string;
  encumbranceStatus: string;
  createdAt: Date;
}

const LandRecordSchema: Schema = new Schema({
  surveyNo: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  area: { type: String, required: true },
  landType: { type: String, required: true },
  encumbranceStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILandRecord>('LandRecord', LandRecordSchema);
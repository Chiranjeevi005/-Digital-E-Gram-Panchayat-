import mongoose, { Document, Schema } from 'mongoose';

export interface ISchemeApplication extends Document {
  citizenId: string;
  schemeId: string;
  schemeName: string;
  applicantName: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  income: string;
  caste: string;
  documents: string[]; // Store file paths or names
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  updatedAt: Date;
}

const SchemeApplicationSchema: Schema = new Schema({
  citizenId: { type: String, required: true },
  schemeId: { type: String, required: true },
  schemeName: { type: String, required: true },
  applicantName: { type: String, required: true },
  fatherName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  income: { type: String },
  caste: { type: String },
  documents: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISchemeApplication>('SchemeApplication', SchemeApplicationSchema);
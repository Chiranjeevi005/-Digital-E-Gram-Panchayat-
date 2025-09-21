import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateApplication extends Document {
  userId: string; // Add userId field
  applicantName: string;
  fatherName?: string;
  motherName?: string;
  certificateType: 'Birth' | 'Death' | 'Marriage' | 'Income' | 'Caste' | 'Residence';
  date: Date;
  place: string;
  // Marriage certificate fields
  brideName?: string;
  groomName?: string;
  witnessNames?: string;
  registrationNo?: string;
  // Income/Caste/Residence certificate fields
  address?: string;
  income?: string;
  caste?: string;
  subCaste?: string;
  ward?: string;
  village?: string;
  district?: string;
  issueDate?: Date;
  validity?: number;
  supportingFiles: string[]; // Store file paths
  status: 'Submitted' | 'In Process' | 'Ready';
  createdAt: Date;
}

const CertificateApplicationSchema: Schema = new Schema({
  userId: { type: String, required: true }, // Add userId field
  applicantName: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  certificateType: { 
    type: String, 
    required: true,
    enum: ['Birth', 'Death', 'Marriage', 'Income', 'Caste', 'Residence']
  },
  date: { type: Date, required: true },
  place: { type: String, required: true },
  // Marriage certificate fields
  brideName: { type: String },
  groomName: { type: String },
  witnessNames: { type: String },
  registrationNo: { type: String },
  // Income/Caste/Residence certificate fields
  address: { type: String },
  income: { type: String },
  caste: { type: String },
  subCaste: { type: String },
  ward: { type: String },
  village: { type: String },
  district: { type: String },
  issueDate: { type: Date },
  validity: { type: Number },
  supportingFiles: [{ type: String }],
  status: { 
    type: String, 
    required: true,
    enum: ['Submitted', 'In Process', 'Ready'],
    default: 'Submitted'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICertificateApplication>('CertificateApplication', CertificateApplicationSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateApplication extends Document {
  applicantName: string;
  certificateType: 'Birth' | 'Death' | 'Marriage' | 'Income' | 'Caste' | 'Residence';
  date: Date;
  place: string;
  supportingFiles: string[]; // Store file paths
  status: 'Submitted' | 'In Process' | 'Ready';
  createdAt: Date;
}

const CertificateApplicationSchema: Schema = new Schema({
  applicantName: { type: String, required: true },
  certificateType: { 
    type: String, 
    required: true,
    enum: ['Birth', 'Death', 'Marriage', 'Income', 'Caste', 'Residence']
  },
  date: { type: Date, required: true },
  place: { type: String, required: true },
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
import mongoose, { Document, Schema } from 'mongoose';

export interface IGrievance extends Document {
  citizenId: string;
  title: string;
  description: string;
  category: string;
  name?: string;
  email?: string;
  phone?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GrievanceSchema: Schema = new Schema({
  citizenId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGrievance>('Grievance', GrievanceSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceRequest extends Document {
  citizenId: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema: Schema = new Schema({
  citizenId: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
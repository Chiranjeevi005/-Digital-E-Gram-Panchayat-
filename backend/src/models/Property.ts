import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  propertyId: string;
  ownerName: string;
  village: string;
  taxDue: number;
  status: string;
  createdAt: Date;
}

const PropertySchema: Schema = new Schema({
  propertyId: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  village: { type: String, required: true },
  taxDue: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProperty>('Property', PropertySchema);
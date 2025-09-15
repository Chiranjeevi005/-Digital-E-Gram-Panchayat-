import mongoose, { Document, Schema } from 'mongoose';

export interface IScheme extends Document {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  createdAt: Date;
}

const SchemeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IScheme>('Scheme', SchemeSchema);
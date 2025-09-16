import mongoose, { Document, Schema } from 'mongoose';

export interface IMutation extends Document {
  applicationId: string;
  propertyId: string;
  statusTimeline: {
    step: string;
    status: string;
    date: Date;
  }[];
  createdAt: Date;
}

const MutationSchema: Schema = new Schema({
  applicationId: { type: String, required: true, unique: true },
  propertyId: { type: String, required: true },
  statusTimeline: [{
    step: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMutation>('Mutation', MutationSchema);
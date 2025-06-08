import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  showhome: boolean;
  stock: number;
  description?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  discount?: number;
  color?: string;
  size?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    showhome: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    description: { type: String },
    sku: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    tags: [{ type: String }],
    discount: { type: Number },
    color: { type: String },
    size: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
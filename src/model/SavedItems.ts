import mongoose from 'mongoose';

const savedItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate saved items
savedItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const SavedItem = mongoose.models.SavedItem || mongoose.model('SavedItem', savedItemSchema);

export default SavedItem; 
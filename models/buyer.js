import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  areaRequired: { type: String, required: true }, // Area the buyer is looking for
  budget: { type: Number, required: true }, // Budget in numeric form
  notes: { type: String }, // Optional notes field
});

const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;

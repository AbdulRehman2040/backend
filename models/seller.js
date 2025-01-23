import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  landlordName: { type: String, required: true },
  landlordPhoneNumber: { type: String, required: true },
  landlordEmailAddress: { type: String, required: true },
  landlordPropertyType: { type: String, required: true }, // e.g., "Apartment", "House", "Commercial"
  landlordPropertyAddress: { type: String, required: true },
  landlordRent: { type: Number, required: true }, // Rent amount in numeric form
  propertyAvailableDate: { type: Date, required: true }, // Availability date
  notes: { type: String }, // Optional notes field
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;

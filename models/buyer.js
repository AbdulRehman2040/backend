import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  areaRequired: { 
    type: String,
    required: true,
    enum: [
      'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford',
      'Liverpool', 'Edinburgh', 'Bristol', 'Wakefield', 'Cardiff', 'Coventry', 'Nottingham',
      'Leicester', 'Sunderland', 'Newcastle', 'Kingston upon Hull', 'Stoke-on-Trent', 'Wolverhampton',
      'Derby', 'Dundee', 'Derry', 'Plymouth', 'Aberdeen', 'Oxford', 'Cambridge'
    ],
  },
  budget: { 
    type: String,
    required: true,
    enum: ['100-200', '200-400', '400-600', '600-1000', '1000+'],
  },
  notes: { type: String },
  propertyAvailableDate: { type: Date, required: true },
});

const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;

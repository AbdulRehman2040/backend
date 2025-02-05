import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  formCreatedDate: { type: Date, default: Date.now },
  landlordName: { type: String, required: true },
  landlordPhoneNumber: { type: String, required: true },
  landlordEmailAddress: { type: String, required: true },
  propertyCategory:{type:String, required:true, enum:['Commercial','Industrial','Land']},
  landlordPropertyType: { type: String, 
    required: true, 
    enum:["Cafe", "Car Wash", "Factory","Healthcare","Hotel","Medical Center","Nursing Homes","Office","Pub","Restaurant","Retail","Shops","Shopping Center","Sports Facilities",'Unit',"Warehouse","Other"] }, // e.g., "Apartment", "House", "Commercial"
  landlordPropertyAddress: { type: String, required: true,
    enum:[
      "Aireborough",
      "Baildon",
      "Bingley",
      "Bradford",
      "Brighouse",
      "Castleford",
      "Colne Valley",
      "Denby Dale",
      "Denholme",
      "Dewsbury",
      "Elland",
      "Featherstone",
      "Halifax",
      "Hebden Royd",
      "Heckmondwike",
      "Hemsworth",
      "Holmfirth",
      "Huddersfield",
      "Ilkley",
      "Keighley",
      "Knottingley",
      "Leeds",
      "Meltham",
      "Mirfield",
      "Morley",
      "Normanton",
      "Ossett",
      "Otley",
      "Pontefract",
      "Pudsey",
      "Queensbury and Shelf",
      "Ripponden",
      "Rothwell",
      "Shipley",
      "Silsden",
      "Skipton",
      "Spenborough",
      "Stanley",
      "Tadcaster",
      "Todmorden",
      "Wakefield",
      "Wetherby",
      "Wharfedale","Other",
    ]
   },
  Size: { type: String, required: true, enum:[ "0-1000 sq. ft.",
    "1000-2000 sq. ft.",
    "2000-3000 sq. ft.",
    "5000-10000 sq. ft.",
    "10000-20000 sq. ft.",
    "20000 sq. ft. +",] }, // Size in square feet
  landlordRent: { type: String, required: true,
    enum:[
      "£0-£1000",
      "£1001-£2000",
      "£2001-£3000",
      "£5001-£10,000",
      "£10,000+",
    ]
   }, // Rent amount in numeric form
   propertyStatus:{ type: String, default: "active" },
 
  notes: { type: String }, // Optional notes field
  adminNotes: String,// New field for admin notes
  
  subscriptionStatus: { type: String, default: 'Subscribed' },
  emailsSent: { type: Number, default: 0 },
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;

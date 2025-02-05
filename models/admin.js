import mongoose from 'mongoose';
const adminSchema = new mongoose.Schema({
  username:{type:String,required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: {type:String},
  resetPasswordExpires: {type:Date},
  timer: { type: Number, default: 0 }, // Add timer field
  initialTime: { type: Number, default: 0 }, // Add initial time field
  isLoopActive: { type: Boolean, default: true },
});
  
const Admin = mongoose.model("Admin", adminSchema);
export default Admin
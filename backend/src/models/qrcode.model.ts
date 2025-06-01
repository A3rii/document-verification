import mongoose from "mongoose";

const qrcodeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Student id reference must be provided"],
  },
  docHash: {
    type: String,
    required: [true, "hash must be provide"],
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const QrCode = mongoose.model("QrCode", qrcodeSchema);                                                                                                                                                                      
export default QrCode;
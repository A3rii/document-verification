import mongoose from "mongoose";

const qrcodeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Student id reference must be provided"],
  },
  docHash: {
    type: String,
    required: [true, "hash must be provided"],
    unique: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  tempPassword: {
    type: String,
    default: "",
  },
  passwordExpiresAt: {
    type: Date,
    default: null,
  },
  accessToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const QrCode = mongoose.model("QrCode", qrcodeSchema);
export default QrCode;

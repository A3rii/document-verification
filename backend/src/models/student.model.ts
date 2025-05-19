import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  owner_id: {
    type: String,
    required: [true, "owner must be provided"],
  },
  name: {
    type: String,
    required: [true, "name must be provided"],
  },
  email: {
    type: String,
    required: [true, "email  must be provided"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password  must be provided"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phone_number: {
    type: String,
    required: [true, "Phone number must be provided for default users"],
    unique: true,
  },
  avatar: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model("User", studentSchema);

export default Student;

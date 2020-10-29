import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, trim: true },
    nickname: String,
    email: { type: String, default: null },
    phone: { type: String, default: null },
    name: { type: String, required: true },
  },
  { collection: "User", timestamps: true }
);

// collection name, schema
export default mongoose.model("User", schema);

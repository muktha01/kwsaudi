import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("Link", linkSchema);


import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  course: { type: String, required: true },
  description: { type: String, default: "" },
  points: { type: Number, default: 100 },
  dueDate: { type: Date, required: true },
  availableFrom: { type: Date, required: true },
  availableUntil: { type: Date, required: true },
  submissions: [{ type: String }]
}, { 
  collection: "assignments",
  timestamps: true 
});

export default assignmentSchema; 
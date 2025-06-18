import mongoose from "mongoose";
<<<<<<< HEAD

const lessonSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  module: { type: String, required: true }
}, { _id: false });

const moduleSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    course: { type: String, required: true },
    lessons: [lessonSchema]
  },
  { 
    collection: "modules",
    timestamps: true 
  }
);

export default moduleSchema;
=======
const schema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    course: { type: String, ref: "CourseModel" },
  },
  { collection: "modules" }
);
export default schema;
>>>>>>> 7c58aaf (a6 commit)

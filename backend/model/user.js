const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  pc_name: String,
  eiin: Number,
  school_name: String,
  pc_id: Number,
  lab_id: Number,
  pc_name: String,
  eiin: Number,
  school_name: String,
  pc_id: String,
  lab_id: String,
  video_name: String,
  location: String,
  pl_start: String,
  start_date_time: String,
  pl_end: String,
  end_date_time: String,
  duration: String,
}, { timestamps: true });

const trackSchema = new Schema({
  start_time: String,
  end_time: String,
  total_time: String,
}, { timestamps: true }  );

const schoolSchema = new Schema({
  pc_name: String,
  eiin: Number,
  school_name: String,
  pc_id: String,
  lab_id: String,
  track: [trackSchema],
   }  , { timestamps: true }  );

const userSchema = new Schema(
  {
    userId: Number,
    mobileNumber: String,
    username: String,
    password: String,
    school: [schoolSchema],
    video: [videoSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

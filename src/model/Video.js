import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxLength: 15 },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, trim: true, minLength: 3 },
  hashtags: [{ type: String, trim: true }],
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, required: true, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;

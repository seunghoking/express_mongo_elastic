import mongoose from "mongoose";

const Schema = mongoose.Schema;

const rateSchema = new Schema({
  stars: { type: Number },
  visitingPurpose: { type: String },
  atmosphere: { type: String },
  facilities: { type: [String] },
});

const detailDataSchema = new Schema({
  postTitle: { type: String },
  thumbnails: { type: [String] },
  pageUrl: { type: String },
  uploaderName: { type: String },
  uploaderId: { type: String, index: true },
  profilePhoto: { type: String },
  uploadedAt: { type: Date },
  content: { type: String },
  contentPlainText: { type: String },
  attachments: { type: [String] },
  commentCount: { type: Number, default: 0, index: true },
  viewCount: { type: Number, default: 0, index: true },
  shareCount: { type: Number, default: 0, index: true },
  likeCount: { type: Number, default: 0, index: true },
  dislikeCount: { type: Number, default: 0, index: true },
  favoriteCount: { type: Number, default: 0 },
  callCount: { type: Number, default: 0 },
  rates: rateSchema,
  isParkingAvailable: { type: Boolean },
  location: { type: String },
  address: { type: String },
  apiUrl: { type: String },
  isTransaction: { type: String },
});

const schema = new Schema(
  {
    brandId: { type: String, required: true },
    articleCode: { type: String, required: true },
    articleType: { type: String, required: true },
    channelKeyname: { type: String, required: true, index: true },
    sentimentAnalysisResult: { type: Number, default: 3 },
    trainedResult: { type: Number, default: null },
    trainedAt: { type: Date, default: null },
    trainerId: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    deleterId: { type: String, default: null },
    deletedAt: { type: Date, default: null },
    detailData: detailDataSchema,
  },
  { collection: "MonitoringData", timestamps: true }
);

schema.index(
  { brandId: 1, channelKeyname: 1, articleCode: 1 },
  { unique: true }
);

schema.index({
  brandId: 1,
  channelKeyname: 1,
  "detailData.uploadedAt": -1,
});

export default mongoose.model("MonitoringData", schema);

import mongoose from "mongoose";

export interface IArticle {
  _id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  owner: mongoose.Schema.Types.ObjectId;
  createdAt: mongoose.Schema.Types.Date;
  updatedAt: mongoose.Schema.Types.Date;
}

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    category: {
      type: String
    },
    content: {
      type:  String,
      required: [true, "Content is required"]
    },
    tags: [{
      type: String
    }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    }
  },
  { timestamps: true }
)

export default mongoose.model<IArticle>("Article", ArticleSchema)
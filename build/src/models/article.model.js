"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ArticleSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    category: {
        type: String
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    tags: [{
            type: String
        }],
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is required"],
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Article", ArticleSchema);

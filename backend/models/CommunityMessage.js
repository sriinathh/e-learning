const mongoose = require("mongoose");

const communityMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'file', 'link'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      size: {
        type: Number
      }
    }],
    reactions: [{
      emoji: {
        type: String
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }],
    isEdited: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityMessage", communityMessageSchema); 
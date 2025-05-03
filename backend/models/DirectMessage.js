const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema(
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
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false
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
    isEdited: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create a compound index to efficiently query conversations between two users
directMessageSchema.index({ sender: 1, recipient: 1 });

module.exports = mongoose.model("DirectMessage", directMessageSchema); 
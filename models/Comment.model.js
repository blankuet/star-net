const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const commentSchema = new Schema(
  {
    User: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      //required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    likes: [
      {
        type: Schema.Types.ObjectId, ref: "User"
      }
    ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;

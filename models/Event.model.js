const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      lowercase: true,
    },
    img:    {
        type: String
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isPrivate: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId, ref: "User"
      }
    ],
    comments: { type: Schema.Types.ObjectId, ref: "Coment"},
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;

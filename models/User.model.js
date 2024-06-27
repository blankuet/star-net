const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    alias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    img: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      require: false,
    },
    website: {
      type: String,
      require: false,
    },
    github: {
      type: String,
      require: false,
    },
    twitter: {
      type: String,
      require: false,
    },
    instagram: {
      type: String,
      require: false,
    },
    facebook: {
      type: String,
      require: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
  {
    strictPopulate: false,
  }
);

const User = model("User", userSchema);

module.exports = User;

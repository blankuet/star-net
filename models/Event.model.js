const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, //Elimina los espacios en blanco al principio y al final
    },
    description: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    img:    {
        type: String,
        required: false
    },
    user: { type: Schema.Types.ObjectId, ref: "User",
      required: false
    },
    
    isPrivate: {
      type: Boolean,
      default: false //Al estar en false, el evento, por defecto, es público
    },
    location: {
      type: String,
      required: false
    },
    likes: [
      {
        type: Schema.Types.ObjectId, ref: "User"
      }
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}],
    date: {
      type: Date,
      default: Date.now, //Esto es para que la fecha y hora sean las actuales, por defecto
      required: true,
      min: '01-01-2024',
      max: '01-01-3024'
      },
    startTime: {
      type: Date,
      required: false,
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

const Event = model("Event", eventSchema);

module.exports = Event;

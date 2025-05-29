const mongoose = require("mongoose");
const { z } = require("zod"); 

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// example of input will be like:
// "title": "My Note",
// "content": "This is the content of my note",
// "date": "2023-10-01T00:00:00.000Z"

const Note = mongoose.model("Note", noteSchema);

module.exports = {
  Note,
};

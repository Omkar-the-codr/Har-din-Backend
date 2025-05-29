const { Note } = require("../models/note.js");
const { noteValidationSchema } = require("../validators/noteValidator.js");

const createNote = async (req, res) => {
  try {
    const noteData = req.body;

    const validationResult = noteValidationSchema.safeParse(noteData);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid note data",
        error: validationResult.error,
      });
    }

    const newNote = await Note.create(validationResult.data);
    if (!newNote) {
      return res.status(400).json({
        message: "Error creating note",
      });
    }

    res.status(201).json(newNote);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating note",
      error: err.message,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const Notes = await Note.find();
    res.status(200).json(Notes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error fetching notes",
      error: err.message,
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.status(200).json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error fetching note",
      error: err.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body);
    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error updating note",
      error: err.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.status(200).json({
      message: "Note deleted successfully",
      note: deletedNote,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error deleting note",
      error: err.message,
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};

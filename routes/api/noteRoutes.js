const router = require('express').Router();
const { Note } = require('../../models');
const { authMiddleware } = require('../../utils/auth');

router.use(authMiddleware);

// GET /api/notes - only current user's notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("Fetched notes for user:", req.user._id);
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/notes - create note owned by current user
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
    });
    res.status(201).json(note);
    console.log("Created note for user:", req.user._id);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT /api/notes/:id - owner only
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    console.log("Updating note for user:", req.user._id);

    if (!note) {
      console.log("No note found with id:", req.params.id)
      return res.status(404).json({ message: 'No note found with this id!' });
      
    }

    if (note.user.toString() !== req.user._id) {
      console.log("Unauthorized update attempt by user:", req.user._id);
      return res.status(403).json({ message: 'User is not authorized to update this note.' });
      
    }

    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;

    const updated = await note.save();
    console.log("Note updated for user:", req.user._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/notes/:id - owner only
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    console.log("Deleting note for user:", req.user._id);

    if (!note) {
     console.log("No note found with id:", req.params.id)
      return res.status(404).json({ message: 'No note found with this id!' });
    }

    if (note.user.toString() !== req.user._id) {
      console.log("Unauthorized delete attempt by user:", req.user._id);
      return res.status(403).json({ message: 'User is not authorized to delete this note.' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted!' });
    console.log("Note deleted for user:", req.user._id);
  } catch (err) {
    res.status(500).json(err);
  }
  console.log("Finished delete operation for user:", req.user._id);
});

module.exports = router;

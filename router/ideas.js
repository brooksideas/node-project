const auth = require('../middleware/auth');
const express = require('express');
const { Ideas, validate } = require('../models/ideas');
const router = express.Router();
module.exports = router;

router.get('/', auth, async (req, res) => {
  const idea = await Ideas.find().sort({ date: -1 });
  res.send(idea);
});

router.get('/:id', auth, async (req, res) => {
  const idea = await Ideas.findById(req.params.id);

  if (!idea) return res.status(404).send('The idea with the given ID was not found.');

  res.send(idea);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let idea = new Ideas({
    ideaOwner: req.body.ideaOwner,
    ideaTitle: req.body.ideaTitle,
    ideaDescription: req.body.ideaDescription,
    ideaCategory: req.body.ideaCategory,
    ideaStatus: req.body.ideaStatus,
    isShared: req.body.isShared
  });
  idea = await idea.save();
  res.send(idea);
});


router.patch('/:id', auth, async (req, res) => {
  await Ideas.findById(req.params.id).then(async (resp) => {
    const idea = await Ideas.findByIdAndUpdate(req.params.id, {
      ideaOwner: req.body.ideaOwner || resp.ideaOwner,
      ideaTitle: req.body.ideaTitle || resp.ideaTitle,
      ideaDescription: req.body.ideaDescription || resp.ideaDescription,
      ideaCategory: req.body.ideaCategory || resp.ideaCategory,
      ideaStatus: req.body.ideaStatus || resp.ideaStatus,
      isShared: req.body.isShared || resp.isShared
    }, { new: true });
    if (idea) return res.send(idea);
    if (!idea) return res.status(404).send('The idea with the given ID was not found.');
  });
});

router.delete('/:id', auth, async (req, res) => {
  const idea = await Ideas.findByIdAndDelete(req.params.id);

  if (!idea) return res.status(404).send('The idea with the given ID was not found.');

  res.send(idea);
});
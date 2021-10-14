const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Users, validate } = require('../models/users');
const router = express.Router();
module.exports = router;
mongoose.set('useFindAndModify', false);


router.get('/', auth, async (req, res) => {
  const users = await Users.find().sort({ date: -1 });
  res.send(users);
});

router.get('/:id', auth, async (req, res) => {
  const users = await Users.findById(req.params.id);

  if (!users) return res.status(404).send('The users with the given ID was not found.');

  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let email = await Users.findOne({ email: req.body.email });
  if (email) return res.status(400).send('User already registered.');

  let user = new Users({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    email: req.body.email,
    occupation: req.body.occupation,
    password: req.body.password,
    isActive: req.body.isActive,
    ideaIdList: req.body.ideaIdList

  });
  //Handles multiple Schema Level Validations
  var err = user.validateSync();
  if (err && err.message) return res.send(err.message.split(':')[2].split(',')[0]);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  res.send(user);
});

router.patch('/:id', auth, async (req, res) => { 

  // if null request sent patch with saved data
  await Users.findById(req.params.id).then(async (resp) => {
    const user = await Users.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName || resp.firstName,
      lastName: req.body.lastName || resp.lastName,
      age: req.body.age || resp.age,
      email: req.body.email || resp.email,
      password: req.body.password || resp.password,
      occupation: req.body.occupation || resp.occupation,
      ideaIdList: req.body.ideaIdList || resp.ideaIdList,
      isActive: req.body.isActive || resp.isActive
    }, { new: true })
 
    if (user) return res.send(user);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  });
});

router.delete('/:id', auth, async (req, res) => {
  const user = await Users.findByIdAndDelete(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});
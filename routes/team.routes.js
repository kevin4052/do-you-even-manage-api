const express = require('express');
const router = express.Router();

const Team = require('../models/Team.model');
const User = require('../models/User.model');

// ****************************************************************************************
// POST - create a team
// ****************************************************************************************
router.post('/teams', (req, res, next) => {
  const user = req.user;
  const { name } = req.body;

  const newTeam = {
    name,
    members: [user._id]
  };

  Team.create(newTeam)
    .then(teamDoc => {
      // console.log({ teamDoc });
      user.teams.push(teamDoc);

      User
        .findByIdAndUpdate(user._id, user, { new: true })
        .then(updatedUser => {

          // console.log({ updatedUser });
          res.status(200).json({ team: teamDoc, user });

        })
        .catch(err => console.log({ err }));
    })
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all user related teams
// ****************************************************************************************
router.get('/teams/:userId', (req, res, next) => {
  Team.find()
    .then(teamDoc => res.status(200).json({ teams: teamDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the teams
// ****************************************************************************************
router.get('/teams', (req, res, next) => {
  Team.find()
    .then(teamDoc => res.status(200).json({ teams: teamDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the team details
// ****************************************************************************************
router.get('/teams/:teamId', (req, res) => {
  Team.findById(req.params.teamId)
    .then(foundTeam => res.status(200).json({ team: foundTeam }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/teams/:teamId/update', (req, res) => {
  Team.findByIdAndUpdate(req.params.teamId, req.body, { new: true })
    .then(updatedTeam => res.status(200).json({ team: updatedTeam }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the team
// ****************************************************************************************
router.post('/teams/:teamId/delete', (req, res) => {
  Team.findByIdAndRemove(req.params.teamId)
    .then(() => res.json({ message: 'Successfully removed!' }))
    .catch(err => next(err));
});

module.exports = router;
const express = require('express');
const router = express.Router();

const Team = require('../models/Team.model');
const User = require('../models/User.model');
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

// ****************************************************************************************
// POST - create a team
// ****************************************************************************************
router.post('/teams', (req, res, next) => {
  const user = req.user;
  const { name, members } = req.body;

  const newTeam = {
    name,
    members
  };

  Team
    .create(newTeam)
    .then(teamDoc => {
      // console.log({ teamDoc });

      // find all team members and push the team Id to the user.teams
      User
        .updateMany({ _id: { $in: members } }, { $push: { teams: teamDoc._id } })
        .then(updatedUser => {
          // console.log("updated users", updatedUser)
          res.status(200).json({ team: teamDoc });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route for all user related teams
// ****************************************************************************************
router.get('/user-teams', (req, res, next) => {
  const user = req.user;
  const { teams } = user;

  Team
    .find({ _id: { $in: teams } })
    .then(teamDoc => res.status(200).json({ teams: teamDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the teams
// ****************************************************************************************
router.get('/teams', (req, res, next) => {
  Team
    .find()
    .then(teamDoc => res.status(200).json({ teams: teamDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the team details
// ****************************************************************************************
router.get('/teams/:teamId', (req, res) => {
  Team
    .findById(req.params.teamId)
    .then(foundTeam => res.status(200).json({ team: foundTeam }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/teams/:teamId/update', (req, res) => {
  Team
    .findByIdAndUpdate(req.params.teamId, req.body, { new: true })
    .then(updatedTeam => res.status(200).json({ team: updatedTeam }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the team
// ****************************************************************************************
router.post('/teams/:teamId/delete', (req, res) => {
  const { teamId } = req.params;

  Team
    .findByIdAndRemove(teamId)
    .then(() => {
      res.json({ message: 'Successfully removed!' })
    })
    .catch(err => next(err));
});

module.exports = router;
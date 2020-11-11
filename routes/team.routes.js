const express = require('express');
const router = express.Router();

const Team = require('../models/Team.model');
const User = require('../models/User.model');

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
      console.log({ newTeam: teamDoc });
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
    .populate('projects members')
    .populate({
      path: 'projects',
      populate: {
        path: 'tasks'
      }
    })
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
router.get('/teams/:teamId', (req, res, next) => {
  Team
    .findById(req.params.teamId)
    .populate('projects members')
    .populate({
      path: 'projects',
      populate: {
        path: 'tasks'
      }
    })
    .then(foundTeam => res.status(200).json({ team: foundTeam }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/teams/:teamId/update', (req, res, next) => {
  const { name, members, projects } = req.body;
  const { teamId } = req.params;

  Team
    .findByIdAndUpdate(teamId, { name, members, projects }, { new: true })
    .then(updatedTeam => res.status(200).json({ team: updatedTeam }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to remove a member from a team
// ****************************************************************************************
router.post('/teams/:teamId/remove-member', (req, res, next) => {
  const { memberId } = req.body;
  const { teamId } = req.params;

  Team
    .findByIdAndUpdate(teamId, { $pull: { members: memberId } }, { new: true })
    .then(updatedTeam => {      
      // console.log({ updatedTeam });
      User
        .findByIdAndUpdate(memberId, { $pull: { teams: teamId } }, { new: true })
        .then(updatedUser => {
          // console.log({ updatedUser });
          res.status(200).json({ team: updatedTeam });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the team
// ****************************************************************************************
router.post('/teams/:teamId/delete', async (req, res, next) => {
  const { teamId } = req.params;

  Team
    .findById(teamId)
    .then(async foundTeam => {
      await foundTeam.remove();
      res.status(200).json({ message: 'Successfully removed!' })     
    })
    .catch(err => next(err));

});

module.exports = router;

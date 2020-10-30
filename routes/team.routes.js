const express = require('express');
const router = express.Router();

const Team = require('../models/Team.model');

// ****************************************************************************************
// POST - create a team
// ****************************************************************************************
router.post('/team', (req, res, next) => {
    Team.create(req.body)
      .then(teamDoc => res.status(200).json({ team: teamDoc }))
      .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the teams
// ****************************************************************************************
router.get('/team', (req, res, next) => {
    Team.find()
      .then(teamDoc => res.status(200).json({ teams: teamDoc }))
      .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the team details
// ****************************************************************************************
router.get('/team/:teamId', (req, res) => {
    Task.findById(req.params.teamId)
      .then(foundTeam => res.status(200).json({ team: foundTeam }))
      .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/team/:teamId/update', (req, res) => {
    Task.findByIdAndUpdate(req.params.teamId, req.body, { new: true })
      .then(updatedTeam => res.status(200).json({ team: updatedTeam }))
      .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the team
// ****************************************************************************************
router.post('/team/:teamId/delete', (req, res) => {
    Task.findByIdAndRemove(req.params.teamId)
      .then(() => res.json({ message: 'Successfully removed!' }))
      .catch(err => next(err));
});

module.exports = router;
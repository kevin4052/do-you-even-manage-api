const express = require('express');
const router = express.Router();

const Project = require('../models/Project.model');

// ****************************************************************************************
// POST - create a project
// ****************************************************************************************
router.post('/project', (req, res, next) => {
  Project.create(req.body)
      .then(projectDoc => res.status(200).json({ project: projectDoc }))
      .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the projects
// ****************************************************************************************
router.get('/project', (req, res, next) => {
  Project.find()
      .then(projectDoc => res.status(200).json({ project: projectDoc }))
      .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the project details
// ****************************************************************************************
router.get('/project/:projectId', (req, res) => {
  Project.findById(req.params.projectId)
      .then(foundProject => res.status(200).json({ project: foundProject }))
      .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/project/:projectId/update', (req, res) => {
  Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true })
      .then(updatedProject => res.status(200).json({ project: updatedProject }))
      .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the project
// ****************************************************************************************
router.post('/project/:projectId/delete', (req, res) => {
  Project.findByIdAndRemove(req.params.projectId)
      .then(() => res.json({ message: 'Successfully removed!' }))
      .catch(err => next(err));
});

module.exports = router;
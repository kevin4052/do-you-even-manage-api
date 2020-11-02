const express = require('express');
const router = express.Router();

const Project = require('../models/Project.model');
const Team = require('../models/Team.model');
const User = require('../models/User.model');

// ****************************************************************************************
// POST - create a project
// ****************************************************************************************
router.post('/project', (req, res, next) => {
  const { name, description, members, teamId } = req.body;
  const user = req.user;

  const newProject = {
    name,
    description,
    team: teamId,
    members: [...members, user._id]
  }  

  Project
    .create(newProject)
    .then(projectDoc => {

      Team
        .findById(teamId)
        .then(async teamDoc => {

          // console.log("team project array", teamDoc.projects)
          // add new project id to related team
          teamDoc.projects.push(projectDoc._id);
          const updatedTeam = await teamDoc.save();

          // *******************************************
          // need to add project to all project members
          // *******************************************

          // add new project to related user
          user.projects.push(projectDoc);
          User
            .findByIdAndUpdate(user._id, user, { new: true })
            .then(updatedUser => {
    
              res.status(200).json({ project: projectDoc, user: updatedUser, team: updatedTeam });
    
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
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
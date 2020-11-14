const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Team = require('../models/Team.model');
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

// ****************************************************************************************
// POST - create a project
// ****************************************************************************************
router.post('/projects', (req, res, next) => {
  const { name, description, team } = req.body;

  const newProject = {
    name,
    description,
    team
  }  

  Project
    .create(newProject)
    .then(projectDoc => {
      console.log('projects', projectDoc);
      Team
        .findById(team)
        .then(async teamDoc => {
          // console.log("team project array", teamDoc.projects)
          // add new project id to related team
          teamDoc.projects.push(projectDoc._id);
          const updatedTeam = await teamDoc.save();    
          res.status(200).json({ project: projectDoc, team: updatedTeam });          
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

});  

// ****************************************************************************************
// GET route to get all the projects
// ****************************************************************************************
router.get('/projects', (req, res, next) => {
  Project
    .find()
    .then(projectDoc => res.status(200).json({ projects: projectDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the projects related to one team
// ****************************************************************************************
router.get('/team-projects/:teamId', (req, res, next) => {
  const { teamId } = req.params;

  Project
    .find({ team: teamId })
    .then(projectDoc => res.status(200).json({ projects: projectDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the project details
// ****************************************************************************************
router.get('/projects/:projectId', (req, res) => {
  Project
    .findById(req.params.projectId)
    .populate('tasks team')
    .populate({
      path: 'team',
      populate: {
        path: 'members'
      }
    })
    .populate({
      path: 'tasks',
      populate: {
        path: 'assigned'
      }
    })
    .then(foundProject => res.status(200).json({ project: foundProject }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/projects/:projectId/update', (req, res) => {
  const { projectId } = req.params;
  // const { name, description, tasks } = req.body;

  Project
    .findByIdAndUpdate(projectId, req.body.projectData, { new: true })
    .then(updatedProject => res.status(200).json({ project: updatedProject }))
    .catch(err => next(err));

});

// ****************************************************************************************
// POST route to delete the project
// ****************************************************************************************
router.post('/projects/:projectId/delete', (req, res, next) => {
  const { projectId } = req.params;

  // console.log({ projectId });

  Project
    .findById(projectId)
    .then(async projectDoc => {
      // await projectDoc.remove();

      // removes all dependencies of selected project
      await Team.findByIdAndUpdate(projectDoc.team, { $pull: { projects: projectDoc._id } });
      await User.updateMany({ tasks: { $in: projectDoc.tasks } }, { $pull: { tasks: { $in: projectDoc.tasks } } });    
      await Task.deleteMany({ project: projectDoc._id });
      projectDoc
        .deleteOne()
        .then(() => res.status(200).json({ message: 'Successfully removed!' }) )
        .catch(err => next(err));  
      // res.status(200).json({ message: 'Successfully removed!' })    
    })
    .catch(err => next(err));

});

module.exports = router;

const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model');
const Project = require('../models/Project.model');
const User = require('../models/User.model');

// ****************************************************************************************
// POST - create a task
// ****************************************************************************************
router.post('/tasks', (req, res, next) => {

  Task
    .create(req.body)
    .then(taskDoc => {
      // console.log('task creation', taskDoc);
      Project
        .findByIdAndUpdate(taskDoc.project, { $push: { tasks: taskDoc._id } }, { new: true })
        .then(updatedProject => {
          // console.log('updated project from task creation', updatedProject);
          User
            .findByIdAndUpdate(taskDoc.assigned, { $push: { tasks: taskDoc._id } }, { new: true })
            .then(updatedUser => {
              // console.log('updated user from task creation', updatedUser);
              res.status(200).json({ task: taskDoc });
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the tasks
// ****************************************************************************************
router.get('/tasks', (req, res, next) => {
  Task
    .find()
    .then(tasksFromDB => res.status(200).json({ tasks: tasksFromDB }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the user tasks
// ****************************************************************************************
router.get('/user-tasks', (req, res, next) => {
  const user = req.user;
  const { tasks } = user;
  Task
    .find({ _id: { $in: tasks } })
    .populate('project')
    .populate({
      path: 'project',
      populate: {
        path: 'team'
      }
    })
    .then(tasksFromDB => res.status(200).json({ tasks: tasksFromDB }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the project tasks
// ****************************************************************************************
router.get('/project-tasks/:projectId', (req, res, next) => {
  const { projectId } = req.params;

  Task
    .find({ project: projectId })
    .then(tasksFromDB => res.status(200).json({ tasks: tasksFromDB }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the task details
// ****************************************************************************************
router.get('/tasks/:taskId', (req, res, next) => {
  Task
    .findById(req.params.taskId)
    .then(foundTask => res.status(200).json({ task: foundTask }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************
router.post('/tasks/:taskId/update', (req, res, next) => {
  Task
    .findByIdAndUpdate(req.params.taskId, req.body.taskdata, { new: true })
    .then(updatedTask => res.status(200).json({ task: updatedTask }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the task
// ****************************************************************************************
router.post('/tasks/:taskId/delete', (req, res, next) => {
  const { taskId } = req.params;

  Task
    .findById(taskId)
    .then(async foundTask => {

      // removes all dependencies of selected task
      Project.findByIdAndUpdate(foundTask.project, { $pull: { tasks: foundTask._id } }).exec();
      User.findByIdAndUpdate(foundTask.assigned, { $pull: { tasks: foundTask._id } }).exec();

      foundTask
        .deleteOne()
        .then(() => res.status(200).json({ message: 'Successfully removed!' }) )
        .catch(err => next(err));
    })
    .catch(err => next(err));

});

module.exports = router;

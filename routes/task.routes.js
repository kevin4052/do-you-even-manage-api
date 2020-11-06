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
    .findByIdAndUpdate(req.params.taskId, req.body, { new: true })
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
      await foundTask.remove();
      res.status(200).json({ message: 'Successfully removed!' });
    })
    .catch(err => next(err));

});

module.exports = router;

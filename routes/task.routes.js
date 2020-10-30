const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model');

// ****************************************************************************************
// POST - create a task
// ****************************************************************************************

// <form action="/tasks" method="POST">
router.post('/tasks', (req, res, next) => {
  Task.create(req.body)
    .then(taskDoc => res.status(200).json({ task: taskDoc }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route to get all the tasks
// ****************************************************************************************

router.get('/tasks', (req, res) => {
  Task.find()
    .then(tasksFromDB => res.status(200).json({ tasks: tasksFromDB }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to delete the task
// ****************************************************************************************

// <form action="/tasks/{{this._id}}/delete" method="post">
router.post('/tasks/:taskId/delete', (req, res) => {
  Task.findByIdAndRemove(req.params.taskId)
    .then(() => res.json({ message: 'Successfully removed!' }))
    .catch(err => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************

// <form action="/tasks/{{foundtask._id}}/update" method="POST">
router.post('/tasks/:id/update', (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedTask => res.status(200).json({ task: updatedTask }))
    .catch(err => next(err));
});

// ****************************************************************************************
// GET route for getting the task details
// ****************************************************************************************

router.get('/tasks/:TaskId', (req, res) => {
  Task.findById(req.params.TaskId)
    .then(foundTask => res.status(200).json({ task: foundTask }))
    .catch(err => next(err));
});

module.exports = router;

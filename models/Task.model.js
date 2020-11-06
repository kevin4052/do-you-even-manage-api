const { Schema, model } = require('mongoose');
const User = require('../models/User.model');
const Team = require('../models/Team.model');
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    dueDate: {
      type: Date
    },
    project: {
      type: Schema.Types.ObjectId, ref: "Project" 
    },
    assigned: {
      type: Schema.Types.ObjectId, ref: "User" 
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
    },
    checklist: { 
      type : Array, 
      default : [] 
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

taskSchema.pre('remove', async function (next) {  
  Project.findByIdAndUpdate(this.project, { $pull: { tasks: this._id } }).exec();
  User.findByIdAndUpdate(this.assigned, { $pull: { tasks: this._id } }).exec();   
  next()
});



module.exports = model('Task', taskSchema);

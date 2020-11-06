const { Schema, model } = require('mongoose');
const User = require('../models/User.model');
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

const teamSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        members: {
            type: [{ type: Schema.Types.ObjectId, ref: "User"}]
        },
        projects: {
            type: [{ type: Schema.Types.ObjectId, ref: "Project"}]
        },
        owner: {
            type: Schema.Types.ObjectId, ref: "User"
        }
    },
    {
        timestamps: true
    }
);

teamSchema.pre('remove', async function (next) {    
    const projectIDs = await Project.find({ team: this._id }, ['_id']).exec();
    const taskIDs = await Task.find({ project: { $in: projectIDs } }, ['_id']).exec();
    
    User.updateMany({ _id: { $in: this.members } }, { $pull: { teams: this._id } }).exec();
    User.updateMany({ _id: { $in: this.members } }, { $pull: { tasks: { $in: taskIDs } } }).exec();    
    Task.deleteMany({ project: {$in: projectIDs }}).exec();
    Project.deleteMany({ _id: {$in: projectIDs }}).exec();

    next()
});

module.exports = model('Team', teamSchema);
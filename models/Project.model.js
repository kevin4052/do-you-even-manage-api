const { Schema, model } = require('mongoose');
const User = require('./User.model');
const Team = require('./Team.model');
const Task = require('./Task.model');

const projectSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        tasks: {
            type: [{ type: Schema.Types.ObjectId, ref: "Task"}]
        },
        team: {
            type: Schema.Types.ObjectId, ref: "Team"
        }
    },
    {
        timestamps: true
    }
);

projectSchema.pre('remove', async function (next) {
    const taskIDs = await Task.find({ project: this._id }, ['_id']).exec();
    
    Team.findByIdAndUpdate(this.team, { $pull: { projects: this._id } }).exec();
    User.updateMany({ tasks: { $in: taskIDs } }, { $pull: { tasks: { $in: taskIDs } } }).exec();    
    Task.deleteMany({ project: this._id }).exec();

    next()
});

module.exports = model('Project', projectSchema);
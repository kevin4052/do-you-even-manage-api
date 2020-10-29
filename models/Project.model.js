const { Schema, model } = require('mongoose');

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
        },
        members: {
            type: [{ type: Schema.Types.ObjectId, ref: "User"}]
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Project', projectSchema);
const { Schema, model } = require('mongoose');

const projectSchema = new Schema (
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Project', projectSchema);
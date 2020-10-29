const { Schema, model } = require('mongoose');

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
    creator: {
      type: Schema.Types.ObjectId, ref: "User"
    },
    assignees: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
    },
    checkList: { 
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


module.exports = model('Task', taskSchema);

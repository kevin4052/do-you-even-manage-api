const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required.']
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    profileImg: {
      type: String,
      default: 'https://icon-library.com/images/profile-picture-icon/profile-picture-icon-20.jpg'
    },
    teams: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team"}]
    },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project"}]
    },
    myTasks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Task"}]
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
    },
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);

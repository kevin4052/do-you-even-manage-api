const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
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
    myTasks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Task"}]
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
    },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project"}]
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
    },
    dueDate:{
        type: Date, 
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{
    timestamps: true
});

// An example of mongoose model task is 
// "title": "taskname",
// "description": "task description",
// "status": "pending",
// "dueDate": "2023-10-01T00:00:00.000Z"
// "createdAt": "2023-09-30T12:00:00.000Z"


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
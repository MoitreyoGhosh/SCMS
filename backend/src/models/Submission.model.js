import mongoose from 'mongoose';


const SubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    textSolution: {
        type: String,
        required: true
    },
    fileSolutionUrl: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        default: 0
    },

},{timestamps: true});


export const Submission = mongoose.model('Submission', SubmissionSchema);
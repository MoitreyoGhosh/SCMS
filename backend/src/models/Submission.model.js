import mongoose from 'mongoose';


const SubmissionSchema = new mongoose.Schema({});


export const Submission = mongoose.model('Submission', SubmissionSchema);
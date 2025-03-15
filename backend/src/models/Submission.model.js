const mongoose = require('mongoose');


const SubmissionSchema = new mongoose.Schema({});


module.exports = mongoose.model('Submission', SubmissionSchema);
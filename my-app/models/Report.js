const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },  // This field should already be here
  status: { type: String, enum: ['Submitted', 'Approved', 'Completed'], default: 'Submitted' }
});

module.exports = mongoose.model('Report', ReportSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Based on frontend/classes.js

const TimeTableSchema = new Schema({
  Lunes: { type: Object, default: {} },
  Martes: { type: Object, default: {} },
  Miércoles: { type: Object, default: {} },
  Jueves: { type: Object, default: {} },
  Viernes: { type: Object, default: {} },
  Sábado: { type: Object, default: {} },
  Domingo: { type: Object, default: {} },
}, { _id: false });

const ScheduleOptionSchema = new Schema({
  index: { type: Number, required: true },
  timeTable: { type: TimeTableSchema, required: true },
  isActive: { type: Boolean, default: true },
  isEditing: { type: Boolean, default: true },
}, { _id: false });

const ActivitySchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  scheduleOptions: [ScheduleOptionSchema],
  isActive: { type: Boolean, default: true },
}, { _id: false });

const ActivityManagerSchema = new Schema({
  activities: [ActivitySchema],
}, { _id: false });

const ScenarioSchema = new Schema({
  name: { type: String, required: true },
  activityManager: { type: ActivityManagerSchema, required: true },
}, { _id: false });

// Main Schema that will be a collection in MongoDB
const ScheduleDataSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true, // Each user has only one schedule document
  },
  scenarios: [ScenarioSchema],
  activeScenarioIndex: {
    type: Number,
    default: -1,
  },
});

module.exports = mongoose.model('scheduledata', ScheduleDataSchema); 
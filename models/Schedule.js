import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

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

const ActivityScheduleOptionSchema = new Schema({
  index: { type: Number, required: true },
  timeTable: { type: TimeTableSchema, required: true },
  isActive: { type: Boolean, default: true },
  isEditing: { type: Boolean, default: true },
}, { _id: false });

const ActivitySchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  activityScheduleOptions: [ActivityScheduleOptionSchema],
  isActive: { type: Boolean, default: true },
}, { _id: false });

const ActivityManagerSchema = new Schema({
  activities: [ActivitySchema],
}, { _id: false });

const ScheduleSchema = new Schema({
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
  schedules: [ScheduleSchema],
  activeScheduleIndex: {
    type: Number,
    default: -1,
  },
});

export default model('scheduledata', ScheduleDataSchema); 
import express from 'express';
import auth from '../../middleware/auth.js';

import ScheduleData from '../../models/Schedule.js';

const router = express.Router();


/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get user's schedule data
 *     description: Get user's schedule data
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's schedule data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleData'
 *       500:
 *         description: Server error
 */

router.get('/', auth, async (req, res) => {
  try {
    const scheduleData = await ScheduleData.findOne({ user: req.user.id });
    if (!scheduleData) {
      // If no data, create initial structure
      const newScheduleData = new ScheduleData({ user: req.user.id });
      await newScheduleData.save();
      return res.json(newScheduleData);
    }
    res.json(scheduleData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});


/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create or update user's schedule data
 *     description: Create or update user's schedule data
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleData'
 *     responses:
 *       200:
 *         description: The updated schedule data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleData'
 *       500:
 *         description: Server error
 */

router.post('/', auth, async (req, res) => {
  const { schedules, activeScheduleIndex } = req.body;

  const scheduleDataFields = {
    user: req.user.id,
    schedules,
    activeScheduleIndex,
  };

  try {
    let scheduleData = await ScheduleData.findOneAndUpdate(
      { user: req.user.id },
      { $set: scheduleDataFields },
      { new: true, upsert: true }
    );
    res.json(scheduleData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});



/**
 * @swagger
 * /api/schedules/combinations:
 *   post:
 *     summary: Calculate and return valid schedule combinations
 *     description: Calculate and return valid schedule combinations
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activities:
 *                 type: array
 *               days:
 *                 type: array
 *               timeSlots:
 *                 type: array
 *     responses:
 *       200:
 *         description: The valid schedule combinations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Server error
 */

router.post('/combinations', auth, (req, res) => {
  const { activities } = req.body;

  // --- Combination Logic (moved from frontend) ---
  
  const getAllCombinations = (
    activities,
    index,
    currentCombination = [],
    allCombinations = []
  ) => {
    if (index >= activities.length) {
      allCombinations.push([...currentCombination]);
      return;
    }
  
    const activity = activities[index];
    for (const activityScheduleOption of activity.activityScheduleOptions) {
      currentCombination.push({
        ...activityScheduleOption,
        name: activity.name,
        color: activity.color,
        totalActivityScheduleOptions: activity.activityScheduleOptions.length,
      });
      getAllCombinations(activities, index + 1, currentCombination, allCombinations);
      currentCombination.pop();
    }
    return allCombinations;
  };
  
  // --- Main Logic ---

  try {
    const allCombinations = getAllCombinations(activities, 0);
    res.json(allCombinations);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }

});

/**
 * @swagger
 * /api/schedules/activities/{scheduleIndex}/{activityIndex}/name:
 *   patch:
 *     summary: Update an activity's name
 *     description: Update the name of a specific activity within a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the schedule containing the activity
 *       - in: path
 *         name: activityIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the activity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the activity
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Activity name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleData'
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Schedule or activity not found
 *       500:
 *         description: Server error
 */

router.patch('/activities/:scheduleIndex/:activityIndex/name', auth, async (req, res) => {
  const { scheduleIndex, activityIndex } = req.params;
  const { name } = req.body;

  // Validate input
  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'El nombre de la actividad es requerido' });
  }

  const scheduleIndexNum = parseInt(scheduleIndex);
  const activityIndexNum = parseInt(activityIndex);

  if (isNaN(scheduleIndexNum) || isNaN(activityIndexNum)) {
    return res.status(400).json({ msg: 'Los índices deben ser números válidos' });
  }

  try {
    let scheduleData = await ScheduleData.findOne({ user: req.user.id });
    
    if (!scheduleData) {
      return res.status(404).json({ msg: 'No se encontraron datos de horarios para este usuario' });
    }

    // Validate schedule index
    if (scheduleIndexNum < 0 || scheduleIndexNum >= scheduleData.schedules.length) {
      return res.status(400).json({ msg: 'Índice de horario inválido' });
    }

    const schedule = scheduleData.schedules[scheduleIndexNum];
    
    // Validate activity index
    if (activityIndexNum < 0 || activityIndexNum >= schedule.activityManager.activities.length) {
      return res.status(400).json({ msg: 'Índice de actividad inválido' });
    }

    // Update the activity name
    scheduleData.schedules[scheduleIndexNum].activityManager.activities[activityIndexNum].name = name.trim();

    // Save the updated data
    scheduleData = await scheduleData.save();
    
    res.json(scheduleData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

export default router; 
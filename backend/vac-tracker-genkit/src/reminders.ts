import { Router } from 'express';
import { db } from './firebase.ts';

const router = Router();

// Return upcoming vaccine reminders (simplified example)
router.get('/', async (_req, res) => {
  try {
    const snapshot = await db.collection('children').get();
    const reminders = snapshot.docs.map(doc => {
      const child = doc.data();
      const upcomingVaccines = [
        { name: 'BCG', weeks: 0 },
        { name: 'OPV', weeks: 6 },
        { name: 'DTP', weeks: 6 }
      ]; // You can calculate based on DOB
      return { childId: child.id, childName: child.name, upcomingVaccines };
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

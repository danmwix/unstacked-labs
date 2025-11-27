import { Router } from 'express';
import { db } from './firebase.ts'; // Make sure your firebase.ts exports the Firestore instance
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Register a child
router.post('/register', async (req, res) => {
  try {
    const child = { id: uuidv4(), ...req.body, vaccines: {} };
    await db.collection('children').doc(child.id).set(child);
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all children
router.get('/', async (_req, res) => {
  try {
    const snapshot = await db.collection('children').get();
    const children = snapshot.docs.map(doc => doc.data());
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get child by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('children').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Child not found' });
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

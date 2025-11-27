import { Router } from 'express';
import { db } from './firebase.ts';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const snapshot = await db.collection('children').get();
    const children = snapshot.docs.map(doc => doc.data());

    const totalChildren = children.length;
    const coverage: Record<string, number> = {};

    const vaccines = ['BCG', 'OPV', 'DTP', 'Measles', 'Yellow Fever'];
    vaccines.forEach(vaccine => {
      const count = children.filter(c => c.vaccines?.[vaccine]).length;
      coverage[vaccine] = totalChildren ? Math.round((count / totalChildren) * 100) : 0;
    });

    res.json({ totalChildren, coverage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

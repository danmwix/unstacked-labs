import express from 'express';
import cors from 'cors';
import childrenRoutes from './src/children.ts';
import remindersRoutes from './src/reminders.ts';
import analyticsRoutes from './src/analytics.ts';
import conversationalAgentRoutes from './src/conversationalAgent.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/children', childrenRoutes);
app.use('/reminders', remindersRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/chat', conversationalAgentRoutes);

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));

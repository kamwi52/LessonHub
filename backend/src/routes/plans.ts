import { Request, Response, Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import {
  getPlanById,
  getPlansByTeacher,
  getPlansByGradeSubjectTerm,
  createPlan,
  updatePlan,
  deletePlan,
  duplicatePlan,
} from '../models/Plan';
import { Plan } from '../models/Plan';

const router = Router();

// Get all plans for current user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const plans = await getPlansByTeacher(req.user.userId, limit, offset);

    res.json({
      data: plans,
      limit,
      offset,
      total: plans.length,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get plans by grade, subject, term (for coordinators)
router.get('/subject/details', authMiddleware, requireRole('coordinator', 'admin'), async (req: Request, res: Response) => {
  try {
    const { subject, grade, term } = req.query;

    if (!subject || !grade || !term) {
      return res.status(400).json({ error: 'Missing query parameters: subject, grade, term' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const plans = await getPlansByGradeSubjectTerm(
      req.user.schoolId,
      subject as string,
      parseInt(grade as string),
      parseInt(term as string)
    );

    res.json(plans);
  } catch (error) {
    console.error('Get plans by subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single plan
router.get('/:planId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const plan = await getPlanById(parseInt(req.params.planId));
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check authorization
    if (!req.user || (plan.teacher_id !== req.user.userId && req.user.role === 'teacher')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new plan
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const planData = {
      ...req.body,
      school_id: req.user.schoolId,
      teacher_id: req.user.userId,
    };

    const plan = await createPlan(planData);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update plan
router.put('/:planId', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const plan = await getPlanById(parseInt(req.params.planId));
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check authorization
    if (plan.teacher_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedPlan = await updatePlan(parseInt(req.params.planId), req.body);
    res.json(updatedPlan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete plan
router.delete('/:planId', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const plan = await getPlanById(parseInt(req.params.planId));
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check authorization
    if (plan.teacher_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deleted = await deletePlan(parseInt(req.params.planId));
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete plan' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Duplicate plan (copy & adapt)
router.post('/:planId/duplicate', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { newTerm, newWeek } = req.body;
    if (newTerm === undefined) {
      return res.status(400).json({ error: 'newTerm is required' });
    }

    const originalPlan = await getPlanById(parseInt(req.params.planId));
    if (!originalPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Create duplicate with new term/week
    const newPlan = await duplicatePlan(
      parseInt(req.params.planId),
      newTerm,
      newWeek
    );

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Duplicate plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export plan as PDF (stub for now)
router.get('/:planId/export/pdf', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const plan = await getPlanById(parseInt(req.params.planId));
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // TODO: Generate PDF using pdf-lib
    res.json({ message: 'PDF export coming soon' });
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

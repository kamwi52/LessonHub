import { query } from '../config/database';

export interface Plan {
  id: number;
  school_id: number;
  teacher_id: number;
  subject: string;
  grade: number;
  term: number;
  week: number;
  title: string;
  description: string;
  learning_objectives: string[];
  activities: string;
  resources: string;
  assessment: string;
  differentiation_notes: string;
  status: 'draft' | 'in_progress' | 'published' | 'archived';
  created_at: Date;
  updated_at: Date;
  version: number;
}

export async function getPlanById(planId: number): Promise<Plan | null> {
  const result = await query(
    'SELECT * FROM plans WHERE id = $1',
    [planId]
  );
  return result.rows[0] || null;
}

export async function getPlansByTeacher(teacherId: number, limit = 50, offset = 0): Promise<Plan[]> {
  const result = await query(
    `SELECT * FROM plans WHERE teacher_id = $1 
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
    [teacherId, limit, offset]
  );
  return result.rows;
}

export async function getPlansByGradeSubjectTerm(
  schoolId: number,
  subject: string,
  grade: number,
  term: number
): Promise<Plan[]> {
  const result = await query(
    `SELECT * FROM plans 
     WHERE school_id = $1 AND subject = $2 AND grade = $3 AND term = $4
     ORDER BY week ASC`,
    [schoolId, subject, grade, term]
  );
  return result.rows;
}

export async function createPlan(planData: Partial<Plan>): Promise<Plan> {
  const result = await query(
    `INSERT INTO plans (
      school_id, teacher_id, subject, grade, term, week, title, description,
      learning_objectives, activities, resources, assessment, differentiation_notes, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      planData.school_id,
      planData.teacher_id,
      planData.subject,
      planData.grade,
      planData.term,
      planData.week,
      planData.title,
      planData.description,
      JSON.stringify(planData.learning_objectives || []),
      planData.activities,
      planData.resources,
      planData.assessment,
      planData.differentiation_notes,
      planData.status || 'draft',
    ]
  );
  return result.rows[0];
}

export async function updatePlan(planId: number, updates: Partial<Plan>): Promise<Plan> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  values.push(planId);
  fields.push('updated_at = NOW()');

  const result = await query(
    `UPDATE plans SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deletePlan(planId: number): Promise<boolean> {
  const result = await query('DELETE FROM plans WHERE id = $1', [planId]);
  return (result.rowCount ?? 0) > 0;
}

export async function duplicatePlan(planId: number, newTerm: number, newWeek: number): Promise<Plan> {
  const originalPlan = await getPlanById(planId);
  if (!originalPlan) throw new Error('Plan not found');

  return createPlan({
    ...originalPlan,
    id: undefined,
    term: newTerm,
    week: newWeek,
    status: 'draft',
  });
}

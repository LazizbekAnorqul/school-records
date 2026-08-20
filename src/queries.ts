import { RayfinClient } from '@microsoft/rayfin-client';
import type { SchoolAppSchema } from '../rayfin/data/schema.js';

const client = new RayfinClient<SchoolAppSchema>({
  baseUrl: 'http://localhost:5168',
  publishableKey: '',
});

export async function getAllStudents() {
  return await client.data.Student.select([
    'id',
    'name',
    'yearGroup'
  ]).execute();
}

export async function getStudentGrades(studentId: string) {
  return await client.data.Enrollment.select([
    'id',
    'subject.name',
    'grade'
  ]).where({ student: { id: { eq: studentId } } })
  .execute();
}

export async function getAverageGradePerSubject() {
  const totals = new Map<string, { sum: number; count: number }>();

  let cursor: string | undefined;
  do {
    let query = client.data.Enrollment.select(['subject.name', 'grade']).first(100);
    if (cursor) {
      query = query.after(cursor);
    }
    const page = await query.executePaginated();

    for (const enrollment of page.items) {
      const entry = totals.get(enrollment.subject.name) ?? { sum: 0, count: 0 };
      entry.sum += enrollment.grade;
      entry.count += 1;
      totals.set(enrollment.subject.name, entry);
    }

    cursor = page.hasNextPage ? page.endCursor : undefined;
  } while (cursor);

  return Array.from(totals, ([subject, { sum, count }]) => ({
    subject,
    averageGrade: sum / count,
  }));
}


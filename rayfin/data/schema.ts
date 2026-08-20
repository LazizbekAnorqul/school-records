import { Todo } from './Todo.js';
import { Teacher } from './Teacher.js';
import { Student } from './Student.js';
import { Subject } from './Subject.js';
import { Enrollment } from './Enrollment.js';

export type SchoolAppSchema = {
  Todo: Todo;
  Teacher: Teacher;
  Student: Student;
  Subject: Subject;
  Enrollment: Enrollment;
};

export const schema = [Todo, Teacher, Student, Subject, Enrollment];

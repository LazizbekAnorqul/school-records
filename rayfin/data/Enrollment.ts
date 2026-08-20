import {
    entity,
    uuid,
    int,
    one,
} from '@microsoft/rayfin-core';

import { Student } from './Student.js';
import { Subject } from './Subject.js';

@entity()
export class Enrollment {
    @uuid() id!: string;
    @one(() => Student) student!: Student;
    @one(() => Subject) subject!: Subject;
    @int({min:0, max:100}) grade!: number;
}

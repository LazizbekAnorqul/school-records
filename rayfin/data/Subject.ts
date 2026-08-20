import  {
    entity,
    uuid,
    text,
    one,
} from '@microsoft/rayfin-core';

import { Teacher } from './Teacher.js';

@entity()
export class Subject {
    @uuid() id!: string;
    @text({ min: 1, max: 100 }) name!: string;
    @one(() => Teacher) teacher!: Teacher;
}

    
import {
    entity,
    uuid,
    text,
    int,
} from '@microsoft/rayfin-core';

@entity()
export class Student {
    @uuid() id!: string;
    @text({ min: 1, max: 100 }) name!: string;
    @int() yearGroup!: number;
}
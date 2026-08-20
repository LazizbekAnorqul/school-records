import {
  entity,
  text,
  uuid,
  email,
} from '@microsoft/rayfin-core';

@entity()
export class Teacher {
    @uuid() id!: string;
    @text({ min: 1, max: 100 }) name!: string;
    @email() email!: string;
}

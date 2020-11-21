import { BaseModel } from './base.model';

export class User extends BaseModel {
    email: string;
    role: string;

    firstName: string;
    lastName: string;
}
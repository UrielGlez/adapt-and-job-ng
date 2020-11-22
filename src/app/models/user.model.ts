import { BaseModel } from './base.model';

export class User extends BaseModel {

    /*constructor(_email, _first_name, _last_name, _id, _updatedAt, _createdAt, _role) {
        super();
        this.email = _email;
        this.firstName = _first_name;
        this.lastName = _last_name;
    }*/

    email: string;
    role: string;

    firstName: string;
    lastName: string;
}
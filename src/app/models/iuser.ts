// export interface UserCreate {
//     name: string;
//     email: string;
//     password: string;
//     password_confirmation: string;
//     birth_year?: string;
//     gender?: string;
// }

export class UserCreate {
    name?: string;
    email: string;
    password: string;
    password_confirmation: string;
    birth_year?: string;
    gender?: string;

    constructor(email: string, password: string, password_confirmation: string, birth_year?: string,
        gender?: string, name?: string,) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.birth_year = birth_year;
        this.gender = gender;
    }
}

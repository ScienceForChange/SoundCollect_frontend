export interface IUserData {
    iat:   number;
    exp:   number;
    roles: string[];
    email: string;
    user:  IUser;
}

export interface IUser {
    id:        number;
    username:  string;
    name:      string;
    email:     string;
    lastLogin: number;
    locale:    string;
}

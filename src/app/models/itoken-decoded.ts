export interface ITokenDecoded {
  id: string;
  exp: number;
  iat: number;
  roles: [];
  username: string;
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    lastLogin: string;
    locale: string;
    code: string;
  };
}

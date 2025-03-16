import {Role} from "./role";


export interface DecodedToken {
    authorities: string[];
    exp: number;
    iat: number;
    role: Role;
    sub: string;
}

import { User } from './user'

export interface LoginResult {
    code: string;
    message: string;
    isAuth: boolean;
    user?: User;
}

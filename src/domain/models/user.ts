export interface User {
    name: string;
    email: string;
    photoUrl: string;
    emailVerified: boolean;
    token: string;
    uid: string;
    creationTime: Date;
    lastSignInTime: Date;
}

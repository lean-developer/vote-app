export interface Member {
    id: number;
    name: string;
    pin?: number;
    key?: string;
    state?: string;
}

export enum MemberState {
    OFFLINE = '',
    ONLINE = 'online',
    AWAY = 'away'
}
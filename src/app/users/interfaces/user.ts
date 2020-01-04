import { SafeUrl } from '@angular/platform-browser';

export interface User {
    id: number;
    username: string;
    password?: string;
    name:string;
    phone?:string;
    avatar?: SafeUrl;
    me?: boolean;
}
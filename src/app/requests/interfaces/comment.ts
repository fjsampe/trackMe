import { User } from "../../users/interfaces/user";

export interface Comment {
    id?: number,
    stars: number;
    user?: User;
    requestCode?: string;
    text:string;
    date?:string;
}

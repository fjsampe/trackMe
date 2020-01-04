import { SafeUrl } from '@angular/platform-browser';

export interface Driver {
    id: string;
    name: string;
    image?:SafeUrl;
    stars:number;
}

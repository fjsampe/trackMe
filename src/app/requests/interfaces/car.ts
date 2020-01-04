import { SafeUrl } from '@angular/platform-browser';

export interface Car {
    id: string;
    brand: string;
    model:string;
    image?:SafeUrl;
    seaters?:number;
    extras?:string;
}
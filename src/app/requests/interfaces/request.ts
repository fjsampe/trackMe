import { Car } from './car';
import { Driver } from './driver';
import { User } from '../../users/interfaces/user';

export interface Request {
    id: number;
    car: Car;
    driver: Driver;
    user: User;
    latStart: number;
    lngStart: number;
    latFinish: number;
    lngFinish: number;
    pickedTime: Date;
    starts: number;
    status: string;
}

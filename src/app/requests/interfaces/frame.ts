export interface Frame {
    id: number,
    imei: string;
    time: string;
    lng: number;
    lat: number;
    accuracy: number;
    speed:number;
    direction:number;
    maxSpeed:number;
    way:string;
    satNumber:number;
    idCar:string;
    typeTick:number;
    typeStartStop?:number;
}

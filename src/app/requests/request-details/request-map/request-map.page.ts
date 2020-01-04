import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Position } from '../../interfaces/position';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { Request } from '../../interfaces/request';
import { Events, AlertController, NavController } from '@ionic/angular';
import { RequestsService } from '../../services/requests.service';
import { StorageService } from '../../../services/storage/storage.service';


const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = Leaflet.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
const colorsRoute=['red','blue','green'];


Leaflet.Marker.prototype.options.icon = iconDefault;


enum statusRequest {
  pending = 0,
  pickUp = 1,
  started = 2,
  finish = 4
};


@Component({
  selector: 'app-request-map',
  templateUrl: './request-map.page.html',
  styleUrls: ['./request-map.page.scss'],
})
export class RequestMapPage implements OnInit {
  interval: any = null;
  mapboxCode: string;
  urlTicks: string;
  request: Request;
  map: Leaflet.Map = null;
  positionCar: Position = {
    lat: null,
    lng: null
  }
  points=[];
  status: number;
  routeCarToMyPos:any;

  arrayPoints=null;

  constructor(
    private events: Events,
    private alertCrl: AlertController,
    private nav: NavController,
    private requestService: RequestsService,
    private storageService: StorageService
  ) {
    console.log("EJECUTO CONSTRUCTOR DE MAPA");
    
    
  }


  ngOnInit() {
    // GET MAPBOXCODE()
    console.log("EJECUTO ON INIT DE MAPA");

  }


  async ionViewDidEnter() {

    console.log("EJECUTO IONVIEW DE MAPA#################### aqui cargo mapa");
    this.showMap();
    this.events.subscribe('request',req=>{console.log("REQUEST: ",req);
      this.request=req;
        this.events.subscribe('mapboxCode', code => {
          this.mapboxCode = code;
          console.log("CONTINUO DESPUES DE PINTAR EL MAPA Y VOY HA HACER LA RUTA VEO CODE...====",this.mapboxCode);
      
          this.status=+this.request.status;
          if (+this.request.status===statusRequest.pickUp){
            this.getCarPosition();
          }else{
            this.showRoute();
          }
          //
        });
      
  
  });
    
   
    
    /** ESTO FUNCIONA
    this.events.subscribe('mapboxCode', code => {
      this.mapboxCode = code;
      this.showMap();
          // GET REQUEST
          //console.log("VOY A ENTRAR EN SUBSCRIBE REQUEST");
      this.events.subscribe('request', request => {
        //console.log("ENTRE EN SUBSCRIBE REQUEST");
        this.request = request;
        this.status = statusRequest.notAvailable;
        this.showRoute();
      });
    });
    */

 //if (this.map === null) { this.leafletMap() };
  }

getRoute(){

}



  getCarPosition() {
    //console.log("ENTRO A GET CAR POSITION");
    /* this.positionCar.lat = 35.7677;
    this.positionCar.lng = -0.54333; */
    this.requestService.getAccessCompany().then((comp)=>{
      let api=comp.urlCompany+comp.pathAPI+ '/seguimiento/ultimaPosicion' + '/7454KRG';
      this.requestService.getLastPosition(api).subscribe((lastPos)=>{
        console.log("LAST POSITION",lastPos);
        this.positionCar.lat=lastPos.lat;
        this.positionCar.lng=lastPos.lng;
        this.showRoute();
        this.setTimer();
      });
    });
  


    //this.status=statusRequest.available;

    //console.log("NECESITO URL TICKS Y TENGO..",this.urlTicks);
    /* this.requestService.getCarPosition(this.urlTicks, this.request.car.id).subscribe((res) => {
      this.positionCar.lat = res.lat;
      this.positionCar.lng = res.lng;
      console.log("VALORES DE POSICION OBTENIDOS");
  
  }); */
  }



  showMap() {
    this.map=new Leaflet.Map('mapId').setView([38.3589714, -0.5044119], 1);
    Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'www.e-vtc.com',
      maxZoom: 18
    }).addTo(this.map);
  }

  showRoute() {
    let posEnd = { lat: null, lng: null };
    let posIni = { lat: null, lng: null };
    //console.log("SHOW ROUTES INIT");

    //  let m=new Marker([-40.99497,174.50808]).addTo(this.map);
    //ESTO ES VALIDO
    /*   for (var i = 0; i < planes.length; i++) {
      let m = new Leaflet.Marker([planes[i][1],planes[i][2]])
        .bindPopup(planes[i][0])
        .addTo(this.map);
    }  
  */

    let redIcon = new Leaflet.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });


   
    switch (this.status) {
      case statusRequest.pickUp: posIni.lat = this.positionCar.lat;
        posIni.lng = this.positionCar.lng;
        posEnd.lat = this.request.latStart;
        posEnd.lng = this.request.lngStart;
        break;
      case statusRequest.pending:  posIni.lat = this.request.latStart;
                                        posIni.lng = this.request.lngStart;
                                        posEnd.lat = this.request.latFinish;
                                        posEnd.lng = this.request.lngFinish;
                                        break;
    }

    
    this.points =
      [
        Leaflet.latLng(posIni.lat, posIni.lng), //start
        Leaflet.latLng(posEnd.lat, posEnd.lng) //stop
      ];

//console.log("POINTS",points);



    //let distance = this.getDistance(this.request.latStart, this.request.lngStart, this.request.latFinish, this.request.lngFinish);
    //console.log("DISTANCIA: ", distance);

   console.log("#################################");
   console.log("###### MAPBOC ##############",this.mapboxCode);
   this.routeCarToMyPos= Leaflet.Routing.control({
      waypoints: this.points,
      routeWhileDragging: true,
      collapsible: true, // hide/show panel routing
      //autoRoute: true, // possibility to take autoRoute
      show: false,

      /*  language: 'es',
       
   formatter: new Leaflet.Routing.Formatter({
     language: 'es'
   }), */
   
   // THIS IS ESPECIALLY WHAT YOU SHOULD ADD (createMarker):
      createMarker: function (i, wp, nWps) {
        return Leaflet.marker(wp.latLng, { icon: redIcon });
      },
      router: Leaflet.Routing.mapbox(this.mapboxCode),
      //OPCIONES DE TRAZO
      lineOptions: {
        styles: [{ color: colorsRoute[this.status], opacity: 1, weight: 5 }],
        addWaypoints: false
      },
    }).addTo(this.map);
    this.arrayPoints=[];
    this.arrayPoints.push(
      [
        Leaflet.latLng(38.37783,-0.51142),
        Leaflet.latLng(38.34525,-0.50747)
      ]
    );
    this.arrayPoints.push(
      [
        Leaflet.latLng(38.36945,-0.50344),
        Leaflet.latLng(38.34525,-0.50747)
      ]
    );
    this.arrayPoints.push(
      [
        Leaflet.latLng(38.36710,-0.50169),
        Leaflet.latLng(38.34525,-0.50747)
      ]
    );
    this.arrayPoints.push(
      [
        Leaflet.latLng(38.36381,-0.50299),
        Leaflet.latLng(38.34525,-0.50747)
      ]
    );
    this.arrayPoints.push(
      [
        Leaflet.latLng(38.36267, -0.50443),
        Leaflet.latLng(38.34525,-0.50747)
      ]
    );
    console.log("ARRAY POINTS",this.arrayPoints);

  }



newRoute(points){
  this.routeCarToMyPos.spliceWaypoints(0,2);
    this.routeCarToMyPos.setWaypoints(points);
}




  /**
   * Set Timer
   */
  setTimer() {
    let x=2;
    this.interval = setInterval(() => {
      this.newRoute(this.arrayPoints[x]);
      console.log("TIMMERRRRR");
      x++;
    }, 20 * 1000);
  }

  /**
   * Clear Timer
   */
  clearTimer() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }


  reloadMap() {
    console.log("RECARGA MAPA");
  }

  /** Remove map when we have multiple map object */

  

  ionViewWillLeave() {
    console.log("SALIMOS DEL MAPA");
    this.map.off();
    this.map.remove();

    this.events.unsubscribe('request');
    this.events.unsubscribe('mapboxCode');
    this.clearTimer()

    //this.clearTimer();
    /* this.map.off();
    this.map.remove();
     *///document.getElementById("mapId").outerHTML = "";

  }





  /**
   * Get distance between 2 marks
   * @param lat1 Latitude position 1 
   * @param lng1 Longitude position 1
   * @param lat2 Latitude position 2
   * @param lng2 Longitude position 2
   * @returns Distance between 2 marks
   */
  getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    let rad = function (x) {
      return x * Math.PI / 180;
    }
    let R = 6378.137; //Earth radius (km)
    let dLat = rad(lat2 - lat1);
    let dLong = rad(lng2 - lng1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.trunc(R * c * 1000);
  }

}






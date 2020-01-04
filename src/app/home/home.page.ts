import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { Configuration } from '../requests/interfaces/configuration';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ToastController, Events } from '@ionic/angular';
import { AuthService } from '../auth/services/auth.service';
import { AccessCompany } from '../auth/interfaces/accessCompany';
import { RequestsService } from '../requests/services/requests.service';
import { EncrDecrService } from '../services/encrypt/encr-decr.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  codeAccessForm: FormGroup;
  myConfig: Configuration;
  pruebaCode = "1/12345";
    pruebasCodeError = "5/12345";
    accessCompany: AccessCompany = null  // Data company

errorCode:boolean=false;

  constructor(
    private storageService: StorageService,
    private events: Events,
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private authService: AuthService,
    private encrDecr: EncrDecrService,
    private requestsService: RequestsService,
    private navCtrl: NavController
  ) { }



  ngOnInit() {
    console.log("ENTRO A HOME......");
    this.showDataTest();
    this.assignValidatorsForm();
  }


  async ionViewWillEnter() {
    
    /* console.log("ENTRO A HOME......");
    this.showDataTest();
    this.assignValidatorsForm(); */


    
  }

  assignValidatorsForm() {
    
    this.codeAccessForm = this.fb.group({
      code: ['', Validators.required],
    });
  }



  showDataTest() {
    let Pass = "1234";
    let encryptedData;
    let base64Encrypt = btoa(this.pruebaCode);
    console.log("BASE64 ENCRYPT CODE: ", base64Encrypt);
    console.log("BASE64 ENCRYPT CODE CON ERROR: ", btoa(this.pruebasCodeError));
  }

  /** 
     * Method that show a message 
     * @param msg   String
     */
    async presentToast(msg: string) {
      const toast = await this.toastCtrl.create({
        duration: 3000,
        position: 'top',
        message: msg
      });
      toast.present();
    }

    async validateAccess() {
      let decodeData = atob(this.codeAccessForm.value.code);
      let parts = decodeData.split('/');

      let mapboxCode: string = null; //Mapbox Code
      let request: Request = null;  // Request
      let urlBase: string; //Url server client
      let idRequest: string; //Request ID
     
      let codeCompany: string = null;
      let pathAPI: string = null;
      let pathImages: string = null;
      let apiCompany: string = null; // url api company 
      let idUsu:string='anonimous'; // Anonimos ID
      let pass:string='anonimous';
      let token:string=null;
      
      if (parts.length === 2) {
        codeCompany=parts[1];
        // Obtengo URL del servidor cliente
        this.authService.getUrlAccess({idCompany:codeCompany}).subscribe((resp) => {
            console.log("resp URL COMPANY:", resp);
            if (resp === undefined) {
              this.presentToast("ERROR: Código Seguimiento erróneo");
            } else {
              this.accessCompany = resp;
            }
            idRequest = parts[0];
            codeCompany = parts[1];
       

            this.authService.getCompany(this.accessCompany.urlCompany + this.accessCompany.pathAPI, this.accessCompany.id).subscribe(
              (resp) => {
                console.log("RESP ADQUIRIENDO MAPBOXCODE: ", resp.mapboxCode);
                mapboxCode = resp.mapboxCode;

                this.authService.login(this.accessCompany, resp.mapboxCode, idUsu,pass).subscribe(
                  async () => {
                    console.log("TOKEN DESDE HOME PAGE.TS",token);
                    this.requestsService.getRequestById(this.accessCompany, +idRequest).subscribe(async (req)=>{
                      //req.user.avatar=req.user.avatar;
                      console.log("REQUEST EN LOGINPAGE VALIDA REQUEST",+req.id);
                      await this.storageService.saveRequest(+req.id);
                      console.log("LOGADO PUBLICADO.....",req);
                      let ver=await this.storageService.getParameters();
                      console.log("VER GRABADO..",ver);
                      this.events.publish('user:requestIn');
                      this.returnToMain();
                    });



                  });
              }
            );
                
          });
      } else {
        this.errorCode=true;
      }
    }
  


  /**
 * Method that return to main page
 */
  returnToMain() {
    this.navCtrl.navigateBack(['requests']);
  }

}

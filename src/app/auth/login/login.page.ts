import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EncrDecrService } from '../../services/encrypt/encr-decr.service';
import { StorageService } from '../../services/storage/storage.service';
import { NavController, ToastController, Events } from '@ionic/angular';
import { RequestsService } from '../../requests/services/requests.service';
import { AccessCompany } from '../interfaces/accessCompany';
import { Request } from '../../requests/interfaces/request';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  pathCompany: string = null;
  //pruebaURL = "http://localhost:3200/api-cf/v1";
  //pruebaURL = "http://192.168.1.91:3200/api-cf/v1";
  pruebaCode = "1/1/12345";
  pruebasCodeError = "5/2/12345";

  regEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

  loginForm: FormGroup;
  codeAccessForm: FormGroup;
  accessCompany: AccessCompany = null  // Data company

  constructor(
    private fb: FormBuilder,
    private encrDecr: EncrDecrService,
    private storageService: StorageService,
    private navCtrl: NavController,
    private authService: AuthService,
    private requestsService: RequestsService,
    private events: Events,
    private toastCtrl: ToastController
  ) { }





  assignValidatorsForm() {
    this.loginForm = this.fb.group({
      //email: ['', Validators.compose([Validators.required, Validators.pattern(this.regEmail)])],
      codCompany: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
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

  ngOnInit() {
    this.showDataTest();
    this.assignValidatorsForm();


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
    let idUsu:string; // Anonimos ID
    let codeCompany: string = null;
    let pathAPI: string = null;
    let pathImages: string = null;
    let apiCompany: string = null; // url api company

    if (parts.length === 3) {
      codeCompany=parts[2];
      // Obtengo URL del servidor cliente
      this.authService.getUrlAccess({ string:codeCompany}).subscribe(
        (resp) => {
          console.log("resp URL COMPANY:", resp);
          if (resp === undefined) {
            this.presentToast("ERROR: Código Seguimiento erróneo");
          } else {
            this.accessCompany = resp;
          }
          idRequest = parts[0];
          idUsu = parts[1];
          this.accessCompany.urlCompany = this.encrDecr.getCrypto(this.accessCompany.urlCompany);
          console.log("URLBASE/codeCompany/idRequest:", this.accessCompany.urlCompany, this.accessCompany.id, idRequest);
          //Obtengo compañia

          this.authService.getCompany(this.accessCompany.urlCompany + this.accessCompany.pathAPI, this.accessCompany.id).subscribe(
            (resp) => {
              console.log("RESP ADQUIRIENDO COMPAÑIA: ", resp, resp.mapboxCode);
              mapboxCode = resp.mapboxCode;
              this.requestsService.getRequestById(this.accessCompany, +idRequest).subscribe(async (req)=>{
                req.user.avatar=req.user.avatar;
                console.log("REQUEST EN LOGINPAGE VALIDA REQUEST",req);
                await this.storageService.setParameters(this.accessCompany, mapboxCode,req.id,null);
                console.log("LOGADO PUBLICADO.....");
                this.events.publish('user:requestIn');
                this.returnToMain();
              });

              //this.authService.accessWithRequest(this.accessCompany,mapboxCode,idRequest);

              
              });
            }
          );
        
    } else {
      this.presentToast("Código Seguimiento erróneo!!")
    }
  }



  async validateLogin() {
    let mapboxCode: string = null;
    this.authService.getUrlAccess({ idCompany: this.loginForm.value.codCompany }).subscribe((resp) => {
      console.log("COMPANYURL:", resp)
      if (resp === undefined) {
        this.presentToast("ERROR: Código Empresa erróneo");
      } else {
        this.accessCompany = resp;
      }
      this.accessCompany.urlCompany = this.accessCompany.urlCompany;
      this.authService.getCompany(this.accessCompany.urlCompany + this.accessCompany.pathAPI, this.accessCompany.id).subscribe(
        (resp) => {
          console.log("RESP ADQUIRIENDO COMPAÑIA: ", resp, resp.mapboxCode);
          this.authService.login(this.accessCompany, resp.mapboxCode, this.loginForm.value.username, this.loginForm.value.password).subscribe(
            () => {
              console.log("LOGADO PUBLICADO.....");
              this.events.publish('user:loggedIn');
              this.returnToMain();
            });
        });
    },
      error => {
        console.log("ERROE EN LOGADO");
      }
    );
  }










  /**
 * Method that return to main page
 */
  returnToMain() {
    this.navCtrl.navigateBack(['']);
  }


}
















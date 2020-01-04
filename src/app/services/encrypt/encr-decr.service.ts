import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

const KEY="123456$#@$^@EVTC";


@Injectable({
  providedIn: 'root'
})
export class EncrDecrService {
  private secureKey: string;
  private secureIV: string;
  constructor() {
    
 }
  
  /*setCrypto(idCar: string):string {
     let key=CryptoJS.enc.Utf8.parse(KEY);
    let iv=CryptoJS.enc.Utf8.parse(KEY);
    let encrypted=CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(idCar.toString()),
    key,
    {
      keySize:128/8,
      mode:CryptoJS.mode.ECB,
      padding:CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();   
}*/

  
  getCrypto(idCar: string):string {
    let key=CryptoJS.enc.Utf8.parse(KEY);
    //let iv=CryptoJS.enc.Utf8.parse(KEY);
    let decrypted=CryptoJS.AES.decrypt(idCar,key,
    {
      keySize:128/8,
      mode:CryptoJS.mode.ECB,
      padding:CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);   
  }
}


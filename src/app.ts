interface Applicant {
  id: number;
  name: string;
  familyName: string;
  address: string;
  countryOfOrigin: string;
  eMailAddress: string;
  age: number;
  hired: string;
}

import { I18N } from 'aurelia-i18n';
import Promise from 'promise-polyfill';
//import 'fetch'
import {inject} from 'aurelia-dependency-injection';
//import {  ValidationRules } from 'aurelia-validation';
//import { addRenderer } from 'aurelia-form-renderer-bootstrap';
import { HttpClient, json } from 'aurelia-fetch-client';
let httpClient = new HttpClient();

export class App {
  message: string = '';
  applicant: Applicant;
  applicantData: Applicant;
  baseUrl: string = "https://localhost:44351/Applicant";
  i18n: I18N;
  controller = null;
  isVisible = true;
  isEdit = false;

  constructor(i18n: I18N) {
   // this.Validationbind();
    this.i18n = i18n;
    //this.i18n.setLocale('de');
    /*this.i18n.setLocale('de')
    .then( () => {
       console.log('Locale is ready!');
    });*/
    this.getApplicants();
  }
 
  Validationbind(){

  /*ValidationRules.ensure('name').required().minLength(4).withMessage("Name field at least 5 Characters")
  .ensure("familyName").required().minLength(4).withMessage("Name field at least 5 Characters")
  .ensure("address").required().minLength(10).withMessage("Name field at least 5 Characters")
  .ensure('eMailAddress').required().withMessage("Not a valid email address.")
  .ensure('age').required().between(20, 60).withMessage("Age must be between 20 to 60 range")
  .on(this.applicantData);*/
  }

  

  //#region  API Call

   getApplicants() {
    httpClient.get(this.baseUrl)
      .then(response => response.json()).then(data => {
        this.applicant = data;
        console.log(data[0].name);
      });
  }

  getApplicantById(id: number) {
    this.DisplayTab('Edit');
    let url = this.baseUrl + '/' + id;
    httpClient.get(url).then(response => response.json()).then(data => {
      this.applicantData = data;
      console.log(this.applicantData);
    });
  }

  ManageApplicant(myPostData) {
    console.log(myPostData);
    if (myPostData.id > 0) {
      httpClient.fetch(this.baseUrl, { method: "PUT", headers: { 'content-type': 'application/json' },
        body: JSON.stringify(myPostData)
      }).then(response => response.json())
        .then(data => {
          console.log(data);
          this.applicantData = data;
          this.message = "Data has modified Successfully";
        });
    } else {
      httpClient.fetch(this.baseUrl, { method: "POST", headers: { 'content-type': 'application/json' },
        body: JSON.stringify(myPostData)
      }).then(response => response.json())
        .then(data => {
          console.log(data);
          this.applicantData = data;
          this.message = "Data has saved Successfully";
        });
    }
   }


  deleteApplicant(id: number) {
    let url = this.baseUrl + '/' + id;
    httpClient.fetch(url, {
      method: "DELETE",
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        this.getApplicants();
        this.message = "Applicant row has deleted Successfully";
      });
  }


  getCountry(country: string) {
    let countryUrl = 'https://restcountries.eu/rest/v2/name/' + country + '?fullText=true';
    httpClient.get(countryUrl)
      .then(response => response.json())
      .then(data => {
        if (!data.status) {
          this.applicantData.countryOfOrigin = data[0].name;
          console.log(data[0].name);
        } else {
          console.log(data.status);
          this.applicantData.countryOfOrigin = "";
          this.message = "Please enter the valid country.";
        }
      });
  }
//#endregion

  Reset(){
    this.applicantData.name='';
    this.applicantData.familyName='';
    this.applicantData.address='';
    this.applicantData.countryOfOrigin='';
    this.applicantData.eMailAddress='';
    this.applicantData.age= null;
    this.applicantData.hired='false';
  }

  DisplayTab(obj: string) {
    if (obj == 'Edit') {
      if (!this.isEdit) {
        this.isVisible = false;
        this.isEdit = true;
      }
    } else if (obj == 'List') {
      if (!this.isVisible) {
        this.isVisible = true;
        this.isEdit = false;
        this.getApplicants();
      }
    }
  }
}

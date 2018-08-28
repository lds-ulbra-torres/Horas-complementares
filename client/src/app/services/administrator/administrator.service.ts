import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { API_URL, APP_KEY, getJwt} from './../../../main';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

@Injectable()
export class AdministratorService {

  private apiUrl: string = API_URL;

  private headers = new Headers(
		{
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getJwt(),
      'app-key': APP_KEY
		}
	);
	private options = new RequestOptions({ headers: this.headers });

  constructor(
    private _http: Http
  ) { }

  /** STUDENTS */
  getStudents(){
    return this._http.get(this.apiUrl + 'students', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStudent(id){
    return this._http.get(this.apiUrl + 'student/'+id, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCertificatesByStudent(student){
    return this._http.get(this.apiUrl + 'certificates/student/'+student, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  /** */

  /** CERTIFICATES */
  getAllCertificates(status){
    return this._http.get(this.apiUrl + 'certificates/all?status='+status, this.options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCertificatesByStudentAndId(id, student){
    return this._http.get(this.apiUrl + 'certificate/'+id+'/student/'+student, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  evaluateCertificate(data, id){
    const creds = JSON.stringify(data);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'certificate/avaliation/'+id, creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }
  /** */

  /** RULES */
  getRules() {
    return this._http.get(this.apiUrl + 'rules', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createRule(rule){
    const creds = JSON.stringify(rule);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'rule', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }

  deleteRule(id){
    return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'rule-delete/'+id, null, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }
  /** */
  /** GROUP RULES */
  getGroups() {
    return this._http.get(this.apiUrl + 'groups', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createGroup(rule){
    const creds = JSON.stringify(rule);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'group', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }

  deletGroup(id){
    return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'group-delete/'+id, null, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }
	/* */
	/** ATA */
	getAtas() {
    return this._http.get(this.apiUrl + 'atas', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
	getAta(id){
    return this._http.get(this.apiUrl + 'ata/'+id, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  createAta(rule){
    const creds = JSON.stringify(rule);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'ata', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }

  deletAta(id){
    return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'ata-delete/'+id, null, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }
	/** */
	/** SETTINGS */
	getEmailModels() {
    return this._http.get(this.apiUrl + 'emails', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createEmailModels(rule){
    const creds = JSON.stringify(rule);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'email/model', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }

  deletEmailModels(id){
    return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'email-delete/'+id, null, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
	}
	
	createAdmin(admin){
    const creds = JSON.stringify(admin);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'auth/admin', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
  }
	/**  */
  private extractData(res: Response) {
		return res.json();
	}

	private handleError(error: Response | any) {
		const TOKEN_NOT_PROVIDED = 1
		const TOKEN_EXPIRED = 2
		const TOKEN_INVALID = 3

		error = JSON.parse(error._body)
		let codeError = error.code
		if (codeError == TOKEN_NOT_PROVIDED || codeError == TOKEN_EXPIRED || codeError == TOKEN_INVALID) {
			alert("Falha ao acessar, faça login novamente!")
			localStorage.removeItem('user');
			sessionStorage.removeItem('user');
			localStorage.removeItem('jwt');
			sessionStorage.removeItem('jwt');
			window.location.replace('login')
		}

		return Observable.throw(error.message || error);
	}

}

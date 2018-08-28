import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { API_URL, APP_KEY, getJwt } from './../../../main';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

@Injectable()
export class StudentService {

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

	private headers_file = new Headers(
		{
			'Authorization': getJwt(),
			'app-key': APP_KEY
		}
	);
	private options_file = new RequestOptions({ headers: this.headers_file });

	constructor(
		private _http: Http
	) { }

	info() {
		return this._http.get(this.apiUrl + 'auth/info', this.options)
			.map(this.extractData)
			.catch(this.handleError);
	}
	totalHours(){
		return this._http.get(this.apiUrl + 'total-hours', this.options)
			.map(this.extractData)
			.catch(this.handleError);
	}
	completeRegister(data) {
		const creds = JSON.stringify(data);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'register', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
					err => {
						resolve(err);
					})
		})
	}

	createCertificate(certificate) {
		//const creds = JSON.stringify(certificate);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'certificate', certificate, this.options_file)
				.subscribe((data) => {
					resolve(data)
				},
					err => {
						resolve(err);
					})
		})
	}

	updateCertificate(certificate, id) {
		//const creds = JSON.stringify(certificate);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'certificate/' + id, certificate, this.options_file)
				.subscribe((data) => {
					resolve(data)
				},
					err => {
						resolve(err);
					})
		})
	}

	getCertificates(status = "", page = 1) {
		return this._http.get(this.apiUrl + 'certificates?status='+status+'&page='+page, this.options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getCertificate(id) {
		return this._http.get(this.apiUrl + 'certificate/' + id, this.options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	deleteCertificate(id) {
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'certificate-delete/' + id, null, this.options)
				.subscribe((data) => {
					resolve(data)
				},
					err => {
						resolve(err);
					})
		})
	}

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

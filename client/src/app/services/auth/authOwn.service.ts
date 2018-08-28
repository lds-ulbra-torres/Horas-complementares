import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { API_URL, APP_KEY, getJwt} from './../../../main';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthOwnService {

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

	info(token = null){
		if(token){
			let  headers = new Headers(
				{
					'Access-Control-Allow-Origin': '*',
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token,
					'app_key': APP_KEY
				}
			);
			let  options = new RequestOptions({ headers: headers });
			return this._http.get(this.apiUrl + 'auth/info', options)
			.map(this.extractData)
			.catch(this.handleError);
		}else{
			return this._http.get(this.apiUrl + 'auth/info', this.options)
			.map(this.extractData)
			.catch(this.handleError);
		}

	}

  login(user) {
    const creds = JSON.stringify(user);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'auth/login', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
	}

	loginGoogle(user) {
    const creds = JSON.stringify(user);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'auth/login/google', creds, this.options)
				.subscribe((data) => {
					resolve(data)
				},
				err => {
					resolve(err);
				})
		})
	}

	createAdmin(user){
		const creds = JSON.stringify(user);
		return new Promise((resolve) => {
			this._http
				.post(this.apiUrl + 'admin/create', creds, this.options)
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

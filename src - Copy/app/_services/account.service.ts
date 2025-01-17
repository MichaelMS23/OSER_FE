﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Services } from '@app/_models/services';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get accountValue(): User {
        return this.userSubject.value;
    }

  getById(id: string) {
    let header = new HttpHeaders();
    header = header.set('TOKEN', localStorage.getItem('token').slice(1,-1));
    return this.http.get<User>(`${environment.apiUrl}/account/${id}`, { headers: header });
  }

    login(email, password) {
        return this.http.post<User>(`${environment.apiUrl}/user/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                /*console.log(this.temp);*/
                console.log(user);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userProfile', JSON.stringify(user.message[0]));
                localStorage.setItem('userid', JSON.stringify(user.message[0].userid));
                localStorage.setItem('token', JSON.stringify(user.message[0].token));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['']);
    }

    verifyCode(email) {
      return this.http.post(`${environment.apiUrl}/user/SendEmail`, {email});
    }

    userActivation(id) {
      return this.http.post(`${environment.apiUrl}/user/Activation/${id}`, {id});
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/user/register`, user);
    }

    forgotpassword(email) {
      return this.http.post<User>(`${environment.apiUrl}/user/ForgetPW/${email}`, {email});
    }

}

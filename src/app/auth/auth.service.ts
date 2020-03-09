
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';
 
export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered? : boolean
}


@Injectable({providedIn: 'root'})
export class AuthService {
    
    user = new Subject<User>();

    constructor(private httpClient: HttpClient){}

    signup(email : string, password :string){
       return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCQaIQtxXN-9BtBmRZw2G-xGtz-oAEU5cE', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError( this.handleError ), tap(resData => {
           this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }  


    login(email:string, password: string){
      return  this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCQaIQtxXN-9BtBmRZw2G-xGtz-oAEU5cE', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError ), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
         }));
    }

    private handleAuth (email:string , userId: string ,  token: string , expireIn: number){
        const expirationDate = new Date(new Date().getTime() + +expireIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }

    private handleError (errorResponse : HttpErrorResponse){
        let errorMessage = 'An unknown error occurred!';
        if(!errorResponse.error || !errorResponse.error.error)
        {
            return throwError(errorMessage);
        }
        switch(errorResponse.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';    
            break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This Email not found';
            break;
            case 'INVALID_PASSWORD': 
                errorMessage = 'This password is not correct';
            break;            
        }
        return throwError(errorMessage);
    }
}

//tap is a operator which we use to performe some logic in our response without changing it 
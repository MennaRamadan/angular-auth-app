import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}


    //problem here is that we want to return an observable also before that there is an observable
    //so the solution is using take operator form rxjs
    intercept(req: HttpRequest<any>, next : HttpHandler){
        // this.authService.user.subscribe();
        // return next.handle(req);

        return  this.authService.user.pipe(take(1), exhaustMap( user => {
            if(!user){
                return next.handle(req);
            }
            const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
            return next.handle(modifiedReq);
        })
    }
}
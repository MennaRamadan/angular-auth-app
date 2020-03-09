import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  constructor(private authService: AuthService){}

  isLoginMode= true;
  isLoading = false;
  error :string = null;

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }


  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;


    let authObs : Observable<AuthResponseData>;

    if(this.isLoginMode){
      authObs = this.authService.login(email, password);
    }
    else{
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe( response => {
      console.log(response);
      this.isLoading = false;
    }, errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    })

    form.reset();
  }

}

import { Component , ComponentFactoryResolver, ViewChild, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { hostViewClassName } from '@angular/compiler';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{

  constructor(private authService: AuthService, 
              private router : Router,
              private componentFactoryResolver: ComponentFactoryResolver){}

  isLoginMode= true;
  isLoading = false;
  error :string = null;
  @ViewChild(PlaceHolderDirective) alertHost : PlaceHolderDirective;
  private subscription:  Subscription;

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
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    })

    form.reset();
  }

  onErrorHandle(){
    this.error = null;
  }


  //here is an approach of creating new alert but not using it with selector or using *ngIf
  private showErrorAlert(error: string){
   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
   const viewContainerRef = this.alertHost.viewContainerRef;
   viewContainerRef.clear();
   const componentRef = viewContainerRef.createComponent(alertCmpFactory); 
   //here to pass message and close event
   componentRef.instance.message = error;
   this.subscription = componentRef.instance.close.subscribe(() => {
    this.subscription.unsubscribe();
    viewContainerRef.clear();
   });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}

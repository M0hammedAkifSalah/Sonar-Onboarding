import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService /* implements HttpInterceptor */{
  token:any;
  constructor() { 
    this.token = localStorage.getItem('token');
  }

  intercept(req:any,next:any){
    let tokenizedReq = req.clone({
      setHeaders : {   
        Authorization : localStorage.getItem('opToken') ? `Bearer ${localStorage.getItem('opToken')}` : `Bearer ${localStorage.getItem('token')}`,
        token: this.token ? this.token : ''
      }
    })
    return next.handle(tokenizedReq)
  }
}

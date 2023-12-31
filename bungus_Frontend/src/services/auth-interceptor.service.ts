import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    if(request.headers.get("No-Auth") === "True") {
      return next.handle(request);
    }

    const token = localStorage.getItem('token')!.replace(/"/g, ''); //removes double quotes from the start and end of the token
    const modifiedReq = this.addToken(request, token);

    return next.handle(modifiedReq).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          console.log(error);
          return throwError("Wrong");
        }
      )
    )
  }

  private addToken(request: HttpRequest<any>, token: String | null) {
    return request.clone( {  headers: request.headers.append('Authorization', 'Bearer '+token) } );
  }
}

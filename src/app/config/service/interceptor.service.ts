import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, catchError, finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  private _activeRequest = 0;

  constructor(private _ngxUiLoaderService: NgxUiLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});

    const reqClone = req.clone({
      headers
    });

    if(this._activeRequest === 0) {
      this._ngxUiLoaderService.start()
    }
    this._activeRequest++;

    return next.handle(reqClone).pipe(
      finalize( () => this._stopLoader() ),
      catchError( (err: HttpErrorResponse) => {
        console.log(err)
        if (err.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el Servidor'
          })
        }
        if (err.status === 422) {
          Swal.fire({
            icon: 'warning',
            title: err.error.message
          })
        }
        if (err.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: err.error.message
          })
        }
        if (err.status === 500) {
          Swal.fire({
            icon: 'error',
            title: err.error.message
          })
        }
        throw 'Error'
      })
    )
  }

  private _stopLoader() {
    this._activeRequest--;
    if (this._activeRequest === 0) {
      this._ngxUiLoaderService.stop();
    }
  }

}

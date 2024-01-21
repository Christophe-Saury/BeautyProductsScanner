import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProductRequestEntity } from 'src/app/entities/product-request.entity';

const API_URL = environment.apiUrl + '/admin/products/'

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {

  constructor(private http: HttpClient) { }

  getProductRequests(page: number): Observable<{products: ProductRequestEntity[]; totalCount: number; totalPages: number}> {
    return this.http.get<{products: ProductRequestEntity[]; totalCount: number; totalPages: number}>(API_URL + 'getAll/' + page,  { responseType: 'json' });
  }

  getProductRequest(id: number): Observable<ProductRequestEntity> {
    return this.http.get<ProductRequestEntity>(API_URL + 'get/' + id,  { responseType: 'json' });
  }

  configProductRequest(id: number, state: number): Observable<any> {
    return this.http.put<any>(API_URL + 'request/' + id + '/' + state,  { responseType: 'json' });
  }

}

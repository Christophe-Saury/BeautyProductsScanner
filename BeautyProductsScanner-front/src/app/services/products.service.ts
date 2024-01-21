import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FullCategorie, ProductCommentEntity, ProductEntity } from '../entities/product.entity';
import { CreateProductRequestEntity } from '../entities/product-request.entity';

const API_URL = environment.apiUrl + '/products/'

@Injectable({
  providedIn: 'root'
})
export class ApiProductsService {

  constructor(private http: HttpClient) { }

  getHomeData(): Observable<{mostLiked: ProductEntity[]; mostCommented: ProductEntity[]}> {
    return this.http.get<any>(API_URL + 'home', { responseType: 'json' });
  }

  search(filter: any, pageIndex: number): Observable<{products: ProductEntity[]; totalCount: number; totalPages: number}> {
    return this.http.get<{products: ProductEntity[]; totalCount: number; totalPages: number}>(API_URL + 'search/' + pageIndex + '?filter=' + encodeURIComponent(JSON.stringify(filter)),  { responseType: 'json' });
  }

  getCategories(): Observable<FullCategorie[]> {
    return this.http.get<FullCategorie[]>(API_URL + 'get-categories',  { responseType: 'json' });
  }

  getProduct(query: any): Observable<{product: ProductEntity | null, comments: ProductCommentEntity[]}> {
    return this.http.get<any>(API_URL + 'get-product',  { params: new HttpParams({ fromObject: query}), responseType: 'json' });
  }

  setGrade(productId: number, grade: number): Observable<ProductEntity> {
    return this.http.put<any>(API_URL + 'grade/' + productId, {grade}, { responseType: 'json' });
  }

  productRequest(productId: number, productRequest: CreateProductRequestEntity): Observable<ProductEntity> {
    return this.http.post<any>(API_URL + productId + '/request', productRequest, { responseType: 'json' });
  }

  createProductRequest(productRequest: CreateProductRequestEntity): Observable<ProductEntity> {
    return this.http.post<any>(API_URL + 'create-product', productRequest, { responseType: 'json' });
  }

  createProductComment(productId: number, comment: string): Observable<{success: boolean, message: string, comment?: ProductCommentEntity}> {
    return this.http.post<any>(API_URL + productId + '/add-comment', {comment: comment }, { responseType: 'json' });
  }

  deleteProductComment(productId: number, commentId: number): Observable<{success: boolean, message: string}> {
    return this.http.put<any>(API_URL + productId + '/comments/' + commentId + '/delete', { responseType: 'json' });
  }
}

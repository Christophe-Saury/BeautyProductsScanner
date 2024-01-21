import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserEntity, UserUpdateAdmin } from 'src/app/entities/user.entity';

const API_URL = environment.apiUrl + '/admin/users/'

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(private http: HttpClient) { }

  getUsers(page: number): Observable<{users: UserEntity[]; totalCount: number; totalPages: number}> {
    return this.http.get<{users: UserEntity[]; totalCount: number; totalPages: number}>(API_URL + 'getAll/' + page,  { responseType: 'json' });
  }

  getUser(id: number): Observable<UserEntity> {
    return this.http.get<UserEntity>(API_URL + 'get/' + id,  { responseType: 'json' });
  }

  update(id: number, user: any): Observable<any> {
    return this.http.put<any>(API_URL + 'update/' + id, user, { responseType: 'json' });
  }

  resetPassword(id: number, password: string): Observable<any> {
    return this.http.put<any>(API_URL + 'resetPassword/' + id, {password: password}, { responseType: 'json' });
  }

}

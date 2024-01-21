import { Injectable, signal } from '@angular/core';
import { UserEntity, UserUpdate } from '../entities/user.entity';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl + '/users/'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user = signal(<UserEntity | undefined>undefined)

  constructor(private http: HttpClient) { }

  loadUser() {
    this.http.get<UserEntity>(API_URL + 'get', { responseType: 'json' }).subscribe({
      next: (data)=>{
        this.user.set(data)
      }
    })
  }

  updateUser(userUpdate: UserUpdate) {
    return this.http.put<any>(API_URL + 'update', userUpdate, { responseType: 'json' })
  }

  updatePassword(password: string): Observable<any> {
    return this.http.put<any>(API_URL + 'updatePassword', {password: password}, { responseType: 'json' });
  }

}

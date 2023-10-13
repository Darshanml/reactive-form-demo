import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserApi = 'https://649af602bf7c145d0239c715.mockapi.io/mock/api/v1/adduser';
  private createUserApi = 'https://649af602bf7c145d0239c715.mockapi.io/mock/api/v1/adduser';

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get<any>(this.getUserApi);
  }

  createUser(userData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this.http.post<any>(this.createUserApi, userData, httpOptions);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const updateUserApi = `${this.createUserApi}/${userId}`;
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this.http.put<any>(updateUserApi, userData, httpOptions);
  }
  
  deleteUser(userId: number): Observable<any> {
    const deleteUserApi = `${this.createUserApi}/${userId}`;
    return this.http.delete<any>(deleteUserApi);
  }

  getUserById(userId: number): Observable<any> {
    const getUserByIdApi = `${this.getUserApi}/${userId}`;
    return this.http.get<any>(getUserByIdApi);
  }
}

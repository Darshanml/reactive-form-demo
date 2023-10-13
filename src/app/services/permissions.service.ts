import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private getPermissionsApi = 'https://64a2699db45881cc0ae5199e.mockapi.io/permission';
  private createPermissionApi = 'https://64a2699db45881cc0ae5199e.mockapi.io/permission';

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<any> {
    return this.http.get<any>(this.getPermissionsApi);
  }

  createPermission(permissionData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this.http.post<any>(this.createPermissionApi, permissionData, httpOptions);
  }

  updatePermission(permissionId: number, permissionData: any): Observable<any> {
    const updatePermissionApi = `${this.createPermissionApi}/${permissionId}`;
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this.http.put<any>(updatePermissionApi, permissionData, httpOptions);
  }
  
  deletePermission(permissionId: number): Observable<any> {
    const deletePermissionApi = `${this.createPermissionApi}/${permissionId}`;
    return this.http.delete<any>(deletePermissionApi);
  }

  getPermissionById(permissionId: number): Observable<any> {
    const getPermissionByIdApi = `${this.getPermissionsApi}/${permissionId}`;
    return this.http.get<any>(getPermissionByIdApi);
  }
}

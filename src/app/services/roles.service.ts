import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private getRolesApi = 'https://649af602bf7c145d0239c715.mockapi.io/mock/api/v1/addrole';
  private createRoleApi = 'https://649af602bf7c145d0239c715.mockapi.io/mock/api/v1/addrole';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get<any>(this.getRolesApi);
  }

  createRole(roleData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this.http.post<any>(this.createRoleApi, roleData, httpOptions);
  }

  updateRole(roleId: number, roleData: any): Observable<any> {
    const updateRoleApi = `${this.createRoleApi}/${roleId}`;
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this.http.put<any>(updateRoleApi, roleData, httpOptions);
  }
  
  deleteRole(roleId: number): Observable<any> {
    const deleteRoleApi = `${this.createRoleApi}/${roleId}`;
    return this.http.delete<any>(deleteRoleApi);
  }

  getRoleById(roleId: number): Observable<any> {
    const getRoleByIdApi = `${this.getRolesApi}/${roleId}`;
    return this.http.get<any>(getRoleByIdApi);
  }
  
}

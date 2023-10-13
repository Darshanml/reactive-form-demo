import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { PermissionFormComponent } from './permission-form/permission-form.component';

const routes: Routes = [
  { path: 'user-form', component: UserFormComponent},
  { path: 'user-form/:id', component: UserFormComponent},
  { path: 'role-form', component: RoleFormComponent},
  { path: 'role-form/:id', component: RoleFormComponent },
  { path: 'permission-form', component: PermissionFormComponent},
  { path: 'permission-form/:id', component: PermissionFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

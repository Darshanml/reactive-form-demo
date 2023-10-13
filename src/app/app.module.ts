import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RolesService } from './services/roles.service';
import { UserService } from './services/user.service';
import { PermissionsService } from './services/permissions.service';

import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DialogComponent } from './dialog/dialog.component';
import { LoginComponent } from './login/login.component';
import { AuthModule } from '@auth0/auth0-angular';



@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    RoleFormComponent,
    PermissionFormComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    LoginComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    HttpClientModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
     AuthModule.forRoot({
      domain: 'dev-3s658da3guswol6c.us.auth0.com',
      clientId: 'Zb9g2Pspe6pVbffttFVk3iCSMMS5BggA',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ],
  providers: [RolesService,UserService,PermissionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

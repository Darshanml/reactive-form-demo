import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from '../services/roles.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
})
export class RoleFormComponent implements OnInit {
  roleForm!: FormGroup;
  selectedRoleId: number | null = null;
  public formTitle: string = 'Create Role';
  public roles: { id: number; roleName: string; roleDescription: string; }[] = [];
  public sortDirection: 'asc' | 'desc' = 'desc';
  public isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const roleId = Number(params.get('id'));
      if (roleId) {
        this.isEditing = true;
        this.selectedRoleId = roleId;
        this.getRoleById(roleId);
        this.formTitle = 'Update Role';
      }
    });
    this.getRoles();
    this.initRoleForm();
  }

  getRoles() {
    this.rolesService.getRoles().subscribe(
      (response) => {
        this.roles = response.sort((a: { id: number }, b: { id: number }) => {
          if (this.sortDirection === 'asc') {
            return a.id - b.id; // Sort in ascending order based on id
          } else {
            return b.id - a.id; // Sort in descending order based on id
          }
        });
        console.log(this.roles);
      },
      (error) => {
        console.error('Error getting roles:', error);
      }
    );
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.getRoles();
  }

  initRoleForm() {
    this.roleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      roleDescription: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    if (this.isEditing) {
      this.updateRole();
    } else {
      this.createRole();
    }

    this.onReset();
    this.isEditing = false;
  }

  createRole() {
    const roleData = {
      roleName: this.roleForm.value.roleName,
      roleDescription: this.roleForm.value.roleDescription,
    };

    this.rolesService.createRole(roleData).subscribe(
      (response) => {
        console.log('Role created:', response);
        this.getRoles();
        this.roleForm.reset();
        this.snackBar.open(
          `New Role Created - Name: ${roleData.roleName}, Description: ${roleData.roleDescription}`,
          'Dismiss',
          {
            duration: 5000,
            horizontalPosition: 'center',
            panelClass: 'centered-snackbar',
          }
        );
      },
      (error) => {
        console.error('Error creating role:', error);
      }
    );
  }

  editRole(role: any) {
    this.isEditing = true;
    this.selectedRoleId = role.id;
    this.roleForm.patchValue({
      roleName: role.roleName,
      roleDescription: role.roleDescription,
    });
    this.formTitle = 'Update Role';
    this.router.navigate(['role-form', role.id]);
  }

  updateRole() {
    if (this.selectedRoleId !== null) {
      const roleId = this.selectedRoleId;
      const roleData = {
        roleName: this.roleForm.value.roleName,
        roleDescription: this.roleForm.value.roleDescription,
      };

      this.rolesService.updateRole(roleId, roleData).subscribe(
        (response) => {
          console.log('Role updated:', response);
          const updatedRole = this.roles.find((role) => role.id === roleId);
          if (updatedRole) {
            updatedRole.roleName = roleData.roleName;
            updatedRole.roleDescription = roleData.roleDescription;
          }

          this.getRoles();
          this.roleForm.reset();
          this.isEditing = false;
          this.selectedRoleId = null;
          this.snackBar.open(
            `Role with ID ${roleId} updated.`,
            'Dismiss',
            {
              duration: 5000,
              horizontalPosition: 'center',
              panelClass: 'centered-snackbar',
            }
          );

          this.router.navigate(['role-form']);
        },
        (error) => {
          console.error('Error updating role:', error);
        }
      );
    }
  }

  getRoleById(roleId: number) {
    this.rolesService.getRoleById(roleId).subscribe(
      (response) => {
        this.roleForm.patchValue({
          roleName: response.roleName,
          roleDescription: response.roleDescription,
        });
      },
      (error) => {
        console.error('Error getting role by ID:', error);
      }
    );
  }

  deleteRole(roleId: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to delete this role?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.deleteRole(roleId).subscribe(
          () => {
            console.log('Role deleted:', roleId);
            this.getRoles();
            this.snackBar.open(
              `Role with ID ${roleId} deleted.`,
              'Dismiss',
              {
                duration: 5000,
                horizontalPosition: 'center',
                panelClass: 'centered-snackbar',
              }
            );
          },
          (error) => {
            console.error('Error deleting role:', error);
          }
        );
      }
    });
  }
  

  onReset() {
    this.roleForm.reset();
    this.isEditing = false;
    this.selectedRoleId = null; 
    this.formTitle = 'Create Role';  
  }
}

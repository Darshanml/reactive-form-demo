import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { MatTextareaAutosizeModule } from '@angular/material/textarea';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionsService } from '../services/permissions.service';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css'],
  providers: [FormBuilder],
})
export class PermissionFormComponent implements OnInit {
  permissionForm!: FormGroup;
  selectedPermissionId: number | null = null;
  public formTitle: string = 'Create Permission';
  public permissions: { id: number; permissionName: string; permissionDescription: string; }[] = [];
  public sortDirection: 'asc' | 'desc' = 'desc';
  public isEditing: boolean = false;

  constructor(private formBuilder: FormBuilder,private permissionsService: PermissionsService,
    private snackBar: MatSnackBar,private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const permissionId = Number(params.get('id'));
      if (permissionId) {
        this.isEditing = true;
        this.selectedPermissionId = permissionId;
        this.getPermissionById(permissionId);
        this.formTitle = 'Update Permission';
      }
    });
    this.getPermissions();
    this.initPermissionForm();
  }

  getPermissions() {
    this.permissionsService.getPermissions().subscribe(
      (response) => {
        this.permissions = response.sort((a: { id: number; }, b: { id: number; }) => {
          if (this.sortDirection === 'asc') {
            return a.id - b.id; // Sort in ascending order based on id
          } else {
            return b.id - a.id; // Sort in descending order based on id
          }
        });
        console.log(this.permissions);
      },
      (error) => {
        console.error('Error getting permissions:', error);
      }
    );
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.getPermissions();
  }

  initPermissionForm() {
    this.permissionForm = this.formBuilder.group({
      permissionName: ['', Validators.required],
      permissionDescription: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    if (this.isEditing) {
      this.updatePermission();
    } else {
      this.createPermission();
    }

    this.onReset();
    this.isEditing = false;
  }

  createPermission() {
    const permissionData = {
      permissionName: this.permissionForm.value.permissionName,
      permissionDescription: this.permissionForm.value.permissionDescription,
    };
  
    this.permissionsService.createPermission(permissionData).subscribe(
      (response) => {
        console.log('Permission created:', response);
        this.getPermissions();
        this.permissionForm.reset();
        this.snackBar.open(`New Permission Created - Name: ${permissionData.permissionName}, Description: ${permissionData.permissionDescription}`, 'Dismiss', {
          duration: 10000, // Snackbar display duration in milliseconds
          horizontalPosition: 'center', // Position the snackbar horizontally in the center
        panelClass: 'centered-snackbar'
        });
      },
      (error) => {
        console.error('Error creating permission:', error);
      }
    );
  }

  editPermission(permission: any) {
    this.isEditing = true;
    this.selectedPermissionId = permission.id;
    this.permissionForm.patchValue({
      permissionName: permission.permissionName,
      permissionDescription: permission.permissionDescription,
    });
    this.formTitle = 'Update Permission';
    this.router.navigate(['permission-form', permission.id]);
  }

  updatePermission() {
    if (this.selectedPermissionId !== null) {
      const permissionId = this.selectedPermissionId;
      const permissionData = {
        permissionName: this.permissionForm.value.permissionName,
        permissionDescription: this.permissionForm.value.permissionDescription,
      };

      this.permissionsService.updatePermission(permissionId, permissionData).subscribe(
        (response) => {
          console.log('Permission updated:', response);
          const updatedPermission = this.permissions.find((permission) => permission.id === permissionId);
          if (updatedPermission) {
            updatedPermission.permissionName = permissionData.permissionName;
            updatedPermission.permissionDescription = permissionData.permissionDescription;
          }

          this.getPermissions();
          this.permissionForm.reset();
          this.isEditing = false;
          this.selectedPermissionId = null;
          this.snackBar.open(
            `Permission with ID ${permissionId} updated.`,
            'Dismiss',
            {
              duration: 5000,
              horizontalPosition: 'center',
              panelClass: 'centered-snackbar',
            }
          );
          this.router.navigate(['permission-form']);
        },
        (error) => {
          console.error('Error updating permission:', error);
        }
      );
    }
  }

  getPermissionById(permissionId: number) {
    this.permissionsService.getPermissionById(permissionId).subscribe(
      (response) => {
        this.permissionForm.patchValue({
          permissionName: response.permissionName,
          permissionDescription: response.permissionDescription,
        });
      },
      (error) => {
        console.error('Error getting permission by ID:', error);
      }
    );
  }

  deletePermission(permissionId: number) {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.permissionsService.deletePermission(permissionId).subscribe(
        () => {
          console.log('Permission deleted:', permissionId);
          this.getPermissions();
          this.snackBar.open(
            `Permission with ID ${permissionId} deleted.`,
            'Dismiss',
            {
              duration: 5000,
              horizontalPosition: 'center',
              panelClass: 'centered-snackbar',
            }
          );
        },
        (error) => {
          console.error('Error deleting permission:', error);
        }
      );
    }
  }
  
  onReset() {
    this.permissionForm.reset();
    this.isEditing = false;
    this.selectedPermissionId = null;
    this.formTitle = 'Create Permission';
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [FormBuilder],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  public formTitle: string = 'Create User';
  selectedUserId: number | null = null;
  public user: { 
    id: number; 
    firstName: string; 
    lastName: string; 
    email: string;
    phoneNumber: number;
    DateOfBirth: Date;
    address: string;
  }[] = [];
  public sortDirection: 'asc' | 'desc' = 'desc';
  public isEditing: boolean = false;


  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private snackBar: MatSnackBar, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('id'));
      if (userId) {
        this.isEditing = true;
        this.selectedUserId = userId;
        this.getUserById(userId);
        this.formTitle = 'Update User';
      }
    });
    this.getUser();
    this.initUserForm();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (response) => {
        this.user = response.sort((a: { id: number; }, b: { id: number; }) => {
          if (this.sortDirection === 'asc') {
            return a.id - b.id; // Sort in ascending order based on id
          } else {
            return b.id - a.id; // Sort in descending order based on id
          }
        });
        console.log(this.user);
      },
      (error) => {
        console.error('Error getting user:', error);
      }
    );
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.getUser();
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEditing) {
      this.updateUser();
    } else {
      this.createUser();
    }

    this.onReset();
    this.isEditing = false;
  }

  createUser() {
    const userData = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.email,
      phoneNumber: this.userForm.value.phone,
      DateOfBirth: this.userForm.value.dob,
      address: this.userForm.value.address,
    };
  
    this.userService.createUser(userData).subscribe(
      (response) => {
        console.log('User created:', response);
        this.getUser();
        this.userForm.reset();
        this.snackBar.open(
          `New User Created - First Name: ${userData.firstName}, Last Name: ${userData.lastName}, Email: ${userData.email},
           Phone No: ${userData.phoneNumber}, Date Of Birth: ${userData.DateOfBirth}, Address: ${userData.address}`,
          'Dismiss',
          {
            duration: 5000,
            horizontalPosition: 'center',
            panelClass: 'centered-snackbar',
          }
        );
      },
      (error) => {
        console.error('Error creating user:', error);
      }
    );
  }

  editUser(user: any) {
    this.isEditing = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phoneNumber,
      dob: this.formatDate(user.DateOfBirth),
      address: user.address,
    });
    this.formTitle = 'Update User';
    this.router.navigate(['user-form', user.id]);
  }

  formatDate(date: string | Date): string {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0];
  }

  updateUser() {
    if (this.selectedUserId !== null) {
      const userId = this.selectedUserId;
      const userData = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        phoneNumber: this.userForm.value.phone,
        DateOfBirth: this.userForm.value.dob,
        address: this.userForm.value.address,
      };

      this.userService.updateUser(userId, userData).subscribe(
        (response) => {
          console.log('User updated:', response);
          const updatedUser = this.user.find((user) => user.id === userId);
          if (updatedUser) {
            updatedUser.firstName = userData.firstName;
            updatedUser.lastName = userData.lastName;
            updatedUser.email = userData.email;
            updatedUser.phoneNumber = userData.phoneNumber;
            updatedUser.DateOfBirth = userData.DateOfBirth;
            updatedUser.address = userData.address;
          }

          this.getUser();
          this.userForm.reset();
          this.isEditing = false;
          this.selectedUserId = null;
          this.snackBar.open(
            `User with ID ${userId} updated.`,
            'Dismiss',
            {
              duration: 5000,
              horizontalPosition: 'center',
              panelClass: 'centered-snackbar',
            }
          );
          this.router.navigate(['user-form']);
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  getUserById(userId: number) {
    this.userService.getUserById(userId).subscribe(
      (response) => {
        this.userForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phone: response.phoneNumber,
          dob: response.DateOfBirth,
          address: response.address
        });
      },
      (error) => {
        console.error('Error getting user by ID:', error);
      }
    );
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted:', userId);
          this.getUser();
          this.snackBar.open(
            `User with ID ${userId} deleted.`,
            'Dismiss',
            {
              duration: 5000,
              horizontalPosition: 'center',
              panelClass: 'centered-snackbar',
            }
          );
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  onReset() {
    this.userForm.reset();
    this.isEditing = false;
    this.selectedUserId = null;
    this.formTitle = 'Create User';
  }
}

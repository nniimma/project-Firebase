import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { User } from 'src/app/models/user';
import { HotToastService } from '@ngneat/hot-toast';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as bootstrap from 'bootstrap';
import { IRole } from 'src/app/models/role';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent {
  constructor(
    private firebaseService: FirebaseService,
    private toast: HotToastService,
    public router: Router
  ) {}

  role!: keyof IRole;
  users!: User[];
  user?: User;

  lessons!: any[];

  modal!: Modal;
  modalHead: string = '';
  currentUser!: any;

  formGp: FormGroup = new FormGroup({
    uid: new FormControl(),
    displayName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    role: new FormControl(),
  });

  ngOnInit() {
    this.list();
    this.firebaseService.getActiveUser.subscribe((d: any) => {
      this.currentUser = d?.role;
      if (this.currentUser === 'student') {
        this.router.navigate(['lessons']);
      }
    });
  }

  setRole() {
    this.firebaseService.getActiveUser.subscribe((user: any) => {
      this.role = user!.role;
    });
  }

  list() {
    this.firebaseService.getUsers().subscribe((data: any) => {
      this.users = data as User[];
    });
  }

  add(el: HTMLElement) {
    this.modalHead = 'Add Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  edit(input: any, el: HTMLElement) {
    this.formGp.setValue(input);
    this.modalHead = 'Edit Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Create
  save() {
    return this.firebaseService.createUser(this.formGp.value);
  }

  destroy(input: User, el: HTMLElement) {
    this.user = input;
    this.modalHead = 'Delete User';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Delete User
  delete() {
    if (this.user) {
      return this.firebaseService.deleteUser(this.user.uid).subscribe(() => {
        this.toast.success('User deleted');
        this.modal.hide();
        this.formGp.reset();
      });
    } else {
      this.toast.error('User not found');
      this.formGp.reset();
      return this.modal.hide();
    }
  }

  close() {
    this.modal.hide();
    this.formGp.reset();
  }
}

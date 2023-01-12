import { Component } from '@angular/core';
import { User } from './models/user';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public firebaseService: FirebaseService) { }

  title = 'Project';
  role!: any;


  ngOnInit() {
    this.firebaseService.getActiveUser.subscribe((d: any) => {
      this.role = d?.role;
    });
  }


  logOut() {
    this.firebaseService.logout();
    localStorage.clear();
    location.href = '/';
  }
}

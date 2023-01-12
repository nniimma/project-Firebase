import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fireBaseService: FirebaseService,
    private toast: HotToastService,
    private router: Router
  ) { }

  ngOnInit() { }

  login(input: any) {
    this.fireBaseService
      .login(input)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully!',
          loading: 'Logging in ...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(({ user }) => {
        this.router.navigate(['lessons']);

      });

  }
}

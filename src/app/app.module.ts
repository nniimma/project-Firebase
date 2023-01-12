import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Environment
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { MembersComponent } from './components/members/members.component';
import { HomeworksComponent } from './components/homeworks/homeworks.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { HotToastModule } from '@ngneat/hot-toast';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { LoginComponent } from './components/auth/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LessonsComponent,
    MembersComponent,
    HomeworksComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    FormsModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

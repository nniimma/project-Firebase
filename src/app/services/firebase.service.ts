import { Homework } from './../models/homwork';
import { Injectable } from '@angular/core';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import * as bcrypt from 'bcryptjs';

// Firebase
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
  deleteUser,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { Lesson } from '../models/lesson';
import { HotToastService } from '@ngneat/hot-toast';

// Models

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  user = authState(this.auth);

  constructor(
    public auth: Auth,
    public storage: Storage,
    public firestore: Firestore,
    private toast: HotToastService
  ) { }

  // Register
  register(input: any) {
    return from(
      createUserWithEmailAndPassword(this.auth, input.email, input.password)
    );
  }

  // Login
  login(input: any) {
    return from(
      signInWithEmailAndPassword(this.auth, input.email, input.password)
    );
  }

  // Logout
  logout() {
    return from(this.auth.signOut());
  }

  // Get Current User
  getAuth() {
    return this.auth.currentUser;
  }

  get getActiveUser() {
    return this.user.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = docData(
          doc(this.firestore, 'users', user!.uid)
        ) as Observable<User>;
        return ref;
      })
    );
  }

  // Get User By ID
  getUserById(uid: string) {
    return docData(doc(this.firestore, 'users', uid)) as Observable<User>;
  }

  // Create User
  createUser(input: any) {
    const hashed = bcrypt.hashSync(input.password, 10);

    return from(
      createUserWithEmailAndPassword(this.auth, input.email, input.password)
    ).subscribe(({ user }) => {
      return from(
        setDoc(doc(this.firestore, 'users', user.uid), {
          displayName: input.displayName,
          email: input.email,
          password: hashed,
          role: input.role,
        })
      );
    });

  }

  // Get Users
  getUsers(): Observable<User[]> {
    return collectionData(collection(this.firestore, 'users'), {
      idField: 'uid',
    }) as Observable<User[]>;
  }

  // Delete User
  deleteUser(uid: string) {
    return from(deleteUser(this.auth.currentUser!)).pipe(() => {
      return from(deleteDoc(doc(this.firestore, 'users', uid)));
    });
  }

  /****** Lessons ******/
  // Fetch ALl
  fetchLessons(): Observable<Lesson[]> {
    return collectionData(collection(this.firestore, 'lessons'), {
      idField: 'uid',
    }) as Observable<Lesson[]>;
  }

  // Create lesson
  createLesson(input: Lesson) {
    return from(addDoc(collection(this.firestore, 'lessons'), input));
  }

  // Update lesson
  updateLesson(input: Lesson) {
    return from(
      updateDoc(doc(this.firestore, 'lessons', input.uid), input as any)
    );
  }

  // Delete lesson
  deleteLesson(uid: string) {
    return from(deleteDoc(doc(this.firestore, 'lessons', uid)));
  }

  /****** homeworks ******/
  // Fetch homework
  fetchHomeworks(): Observable<Homework[]> {
    return collectionData(collection(this.firestore, 'homeworks'), {
      idField: 'uid',
    }) as Observable<Homework[]>;
  }

  fetchHomeworksByLesson(lessonUid: string) {
    const q = query(
      collection(this.firestore, 'homeworks'),
      where('lessonId', '==', lessonUid)
    );

    return collectionData(q, { idField: 'uid' }) as Observable<Homework[]>;
  }

  // Create homework
  createHomework(input: Homework) {
    return from(addDoc(collection(this.firestore, 'homeworks'), input));
  }

  // Update homework
  updateHomework(input: Homework) {
    return from(
      updateDoc(doc(this.firestore, 'homeworks', input.uid), input as any)
    );
  }

  // Delete homework
  deleteHomework(uid: string) {
    return from(deleteDoc(doc(this.firestore, 'homeworks', uid)));
  }
}

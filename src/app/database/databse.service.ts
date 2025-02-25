import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';
import { Category } from './models/category.model';
import { Expense } from './models/expenses.model';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private firestore: Firestore) {}

  // Save a new user profile with default category & expense
  saveUserProfile(userId: string, email: string, hashedPassword: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    const expensesRef = collection(this.firestore, `users/${userId}/expenses`);
    const categoriesRef = collection(this.firestore, `users/${userId}/categories`);

    const batch = writeBatch(this.firestore);

    // Add user doc
    batch.set(userRef, { email, hashedPassword, createdAt: new Date() });

    // Default category
    const defaultCategoryRef = doc(categoriesRef);
    batch.set(defaultCategoryRef, { name: 'Groceries' });

    // Default expense
    const defaultExpenseRef = doc(expensesRef);
    batch.set(defaultExpenseRef, {
      name: 'Example Expense',
      amount: 0,
      date: new Date().toISOString(),
      categoryId: defaultCategoryRef.id
    });

    return from(batch.commit()).pipe(
      tap(() => console.log('User profile saved successfully!')),
      catchError((error) => {
        console.error('Firestore Error:', error);
        return throwError(() => new Error('Firestore write failed'));
      })
    );
  }

  getUserProfile(userId: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    );
  }

  updateUserPassword(userId: string, newPassword: string): Observable<void> {
    const hashedPassword = btoa(newPassword);
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { hashedPassword }));
  }

  // ----------------------------
  // CRUD for Categories
  // ----------------------------
  addCategory(userId: string, category: Omit<Category, 'id'>): Observable<string> {
    const categoryRef = collection(this.firestore, `users/${userId}/categories`);

    return from(addDoc(categoryRef, { name: category.name })).pipe(
      tap((docRef) =>
        console.log('Category added successfully with ID:', docRef.id)
      ),
      tap((docRef) => {
        // Optionally store the doc ID in the doc itself
        const categoryDoc = doc(this.firestore, `users/${userId}/categories/${docRef.id}`);
        updateDoc(categoryDoc, { id: docRef.id });
      }),
      map((docRef) => docRef.id)
    );
  }

  getCategories(userId: string): Observable<Category[]> {
    const categoryRef = collection(this.firestore, `users/${userId}/categories`);
    // Returns Category[] with each doc having an 'id' property
    return collectionData(categoryRef, { idField: 'id' }) as Observable<Category[]>;
  }

  updateCategory(userId: string, categoryId: string, updatedName: string): Observable<void> {
    const categoryDocRef = doc(this.firestore, `users/${userId}/categories/${categoryId}`);
    return from(updateDoc(categoryDocRef, { name: updatedName }));
  }

  deleteCategory(userId: string, categoryId: string): Observable<void> {
    const categoryDocRef = doc(this.firestore, `users/${userId}/categories/${categoryId}`);
    return from(deleteDoc(categoryDocRef)).pipe(
      tap(() => console.log(`Category ${categoryId} deleted successfully!`))
    );
  }

  // ----------------------------
  // CRUD for Expenses
  // ----------------------------
  addExpense(userId: string, expense: Omit<Expense, 'id'>): Observable<void> {
    const expensesRef = collection(this.firestore, `users/${userId}/expenses`);
    return from(addDoc(expensesRef, expense)).pipe(
      map(() => console.log('Expense added successfully!'))
    );
  }

  getExpenses(userId: string): Observable<Expense[]> {
    const expensesRef = collection(this.firestore, `users/${userId}/expenses`);
    return collectionData(expensesRef, { idField: 'id' }) as Observable<Expense[]>;
  }

  getExpensesForDate(userId: string, date: string): Observable<Expense[]> {
    const expensesRef = collection(this.firestore, `users/${userId}/expenses`);
    const q = query(expensesRef, where('date', '==', date));
    const querySnapshotPromise = getDocs(q);

    return from(querySnapshotPromise).pipe(
      map((snap) => snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense)))
    );
  }

  getWeeklyExpenses(userId: string, startDate: string, endDate: string): Observable<Expense[]> {
    const expensesRef = collection(this.firestore, `users/${userId}/expenses`);
    const q = query(expensesRef, where('date', '>=', startDate), where('date', '<=', endDate));
    return collectionData(q, { idField: 'id' }) as Observable<Expense[]>;
  }

  updateExpense(userId: string, expenseId: string, updatedExpense: Partial<Expense>): Observable<void> {
    const expenseRef = doc(this.firestore, `users/${userId}/expenses/${expenseId}`);
    return from(updateDoc(expenseRef, updatedExpense));
  }

  deleteExpense(userId: string, expenseId: string): Observable<void> {
    const expenseRef = doc(this.firestore, `users/${userId}/expenses/${expenseId}`);
    return from(deleteDoc(expenseRef));
  }
}

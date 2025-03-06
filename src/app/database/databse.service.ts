import { Injectable } from "@angular/core";
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
  updateDoc,
  where,
  writeBatch
} from "@angular/fire/firestore";
import { catchError, from, map, Observable, tap, throwError } from "rxjs";
import { Category } from "./models/category.model";
import { Expense } from "./models/expenses.model";

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private firestore: Firestore) {}

  saveUserProfile(userId: string, email: string, hashedPassword: string): Observable<void> {
    const userRef = doc(this.firestore, "users", userId);
    const expensesRef = collection(this.firestore, "users", userId, "expenses");
    const categoriesRef = collection(this.firestore, "users", userId, "categories");

    const batch = writeBatch(this.firestore);

    batch.set(userRef, { email, hashedPassword, createdAt: new Date() });

    // Set a default category
    const defaultCategoryRef = doc(categoriesRef);
    batch.set(defaultCategoryRef, { name: "Groceries" });

    // Set a default expense referencing the default category
    const defaultExpenseRef = doc(expensesRef);
    batch.set(defaultExpenseRef, {
      name: "Example Expense",
      amount: 0,
      date: new Date().toISOString(),
      categoryId: defaultCategoryRef.id
    });

    return from(batch.commit()).pipe(
      tap(() => console.log("User profile saved successfully!")),
      catchError((error) => {
        console.error("Firestore Error:", error);
        return throwError(() => new Error("Firestore write failed"));
      })
    );
  }

  getUserProfile(userId: string): Observable<any> {
    const userRef = doc(this.firestore, "users", userId);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    );
  }

  updateUserPassword(userId: string, newPassword: string): Observable<void> {
    const hashedPassword = btoa(newPassword);
    const userRef = doc(this.firestore, "users", userId);
    return from(updateDoc(userRef, { hashedPassword }));
  }

  // CRUD for Categories

  addCategory(userId: string, category: Category): Observable<void> {
    const categoryRef = collection(this.firestore, "users", userId, "categories");
    return from(addDoc(categoryRef, category)).pipe(
      tap((docRef) => console.log("Category added successfully with ID:", docRef.id)),
      tap((docRef) => {
        // Optionally update the document to store its own ID
        const categoryDoc = doc(this.firestore, "users", userId, "categories", docRef.id);
        updateDoc(categoryDoc, { id: docRef.id });
      }),
      map(() => {
        // Return void; console log already handled above
      })
    );
  }

  getCategories(userId: string): Observable<Category[]> {
    const categoryRef = collection(this.firestore, "users", userId, "categories");
    const querySnapshot = getDocs(categoryRef);
    return from(querySnapshot).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Category))
      )
    );
  }

  updateCategory(userId: string, categoryId: string, updatedName: string): Observable<void> {
    const categoryRef = doc(this.firestore, "users", userId, "categories", categoryId);
    return from(updateDoc(categoryRef, { name: updatedName }));
  }

  deleteCategory(userId: string, categoryId: string): Observable<void> {
    const categoryRef = doc(this.firestore, "users", userId, "categories", categoryId);
    return from(deleteDoc(categoryRef));
  }

  // CRUD for Expenses

  addExpense(userId: string, expense: Omit<Expense, 'id'>): Observable<void> {
    const expensesRef = collection(this.firestore, "users", userId, "expenses");
    return from(addDoc(expensesRef, expense)).pipe(
      map(() => console.log("Expense added successfully!"))
    );
  }

  getExpenses(userId: string): Observable<Expense[]> {
    const expensesRef = collection(this.firestore, "users", userId, "expenses");
    return collectionData(expensesRef, { idField: 'id' }) as Observable<Expense[]>;
  }

  getExpensesForDate(userId: string, date: string): Observable<Expense[]> {
    const expensesRef = collection(this.firestore, "users", userId, "expenses");
    const q = query(expensesRef, where("date", "==", date));
    const querySnapshot = getDocs(q);
    return from(querySnapshot).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Expense))
      )
    );
  }

  getWeeklyExpenses(userId: string, startDate: string, endDate: string): Observable<Expense[]> {
    const expensesRef = collection(this.firestore, "users", userId, "expenses");
    const q = query(expensesRef, where("date", ">=", startDate), where("date", "<=", endDate));
    return collectionData(q, { idField: 'id' }) as Observable<Expense[]>;
  }

  updateExpense(userId: string, expenseId: string, updatedExpense: Partial<Expense>): Observable<void> {
    const expenseRef = doc(this.firestore, "users", userId, "expenses", expenseId);
    return from(updateDoc(expenseRef, updatedExpense));
  }

  deleteExpense(userId: string, expenseId: string): Observable<void> {
    const expenseRef = doc(this.firestore, "users", userId, "expenses", expenseId);
    return from(deleteDoc(expenseRef));
  }
}

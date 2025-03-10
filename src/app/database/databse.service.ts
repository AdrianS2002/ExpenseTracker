import { Injectable } from "@angular/core";
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, runTransaction, setDoc, updateDoc, where, writeBatch } from "@angular/fire/firestore";
import { catchError, from, map, Observable, tap, throwError } from "rxjs";
import { Category } from "./models/category.model";
import { Expense } from "./models/expenses.model";

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private firestore: Firestore) {}

  // Save a new user profile with default category & expense
  saveUserProfile(userId: string, email: string, hashedPassword: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    const expensesRef = collection(this.firestore, `users/${userId}/expenses`);
    const categoriesRef = collection(this.firestore, `users/${userId}/categories`);

    const batch = writeBatch(this.firestore);

    // Define a user data object
    const userData = {
      email: email,
      hashedPassword: hashedPassword,
      weeklySpendingCap: 0, // Default weekly spending cap
      capLastUpdated: new Date().toISOString(), // Current date
      createdAt: new Date()
    };

    // Add user document with default values
    batch.set(userRef, userData);

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

  // Fetch the user's weekly spending cap
  fetchWeeklyCap(userId: string): Observable<{ weeklySpendingCap: number, capLastUpdated: string | null }> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        const data = docSnap.data();
        return {
          weeklySpendingCap: data?.['weeklySpendingCap'] || 0,
          capLastUpdated: data?.['capLastUpdated'] || null
        };
      }),
      catchError((error) => {
        console.error('Error fetching weekly cap:', error);
        return throwError(() => new Error('Failed to fetch weekly cap'));
      })
    );
  }

  // Update the user's weekly spending cap
  updateWeeklyCap(userId: string, cap: number): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, {
      weeklySpendingCap: cap,
      capLastUpdated: new Date().toISOString()
    })).pipe(
      tap(() => console.log('Weekly cap updated successfully!')),
      catchError((error) => {
        console.error('Error updating weekly cap:', error);
        return throwError(() => new Error('Failed to update weekly cap'));
      })
    );
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
    const categoriesRef = collection(this.firestore, `users/${userId}/categories`);

    return from(
        runTransaction(this.firestore, async (transaction) => {
            const querySnapshot = await getDocs(categoriesRef);

            const categories: Category[] = [];
            for (const categoryDoc of querySnapshot.docs) {
                const categoryRef = doc(this.firestore, `users/${userId}/categories/${categoryDoc.id}`);
                const docSnap = await transaction.get(categoryRef);
                if (docSnap.exists()) {
                    categories.push({ id: docSnap.id, ...docSnap.data() } as Category);
                }
            }

            return categories;
        })
    );
}

  //   getCategories(userId: string): Observable<Category[]> {
  //       console.log('Fetching categories for user ID:', userId);
  //   const categoryRef = collection(this.firestore, `users/${userId}/categories`);
  //   const categoryQuery: Query = query(categoryRef, orderBy('name'));
  //   console.log('Query details:', categoryQuery);
  //   return collectionData(categoryQuery, { idField: 'id' }) as Observable<Category[]>;
  //   // const categoriesRef = collection(this.firestore, `users/${userId}/categories`);
  //   // return collectionData(categoriesRef,{idField: 'id'}) as Observable<Category[]>; 
  // }
  
  

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
    
    // Assume the passed date is in "YYYY-MM-DD" format.
    // Construct the start of the day and the start of the next day as ISO strings.
    const startDate = date + "T00:00:00.000Z";
    const nextDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString();
    
    const q = query(expensesRef,
      where('date', '>=', startDate),
      where('date', '<', nextDate)
    );
    
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

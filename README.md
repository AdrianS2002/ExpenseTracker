# [Expense Tracker App](https://expense-tracker-umber-rho-82.vercel.app/) 

The **Expense Tracker** app is a web application built with Angular that allows users to manage their daily expenses in a simple and efficient way. The app is designed to be mobile-friendly, offering features such as adding, viewing, and deleting expenses, as well as providing a weekly summary of expenses.

[Click here to see the app!
](https://expense-tracker-umber-rho-82.vercel.app/)
## Key Features

1. **Authentication and Account Management**:
   - Signup, Login, and Reset Password (implemented with Firebase Authentication).
   - Two public pages (Authentication and Home), with the rest of the app protected by authentication.

2. **Expense Management**:
   - Add expenses for the current week (only for past days and the current day).
   - View expenses added for each day.
   - Delete existing expenses.
   - Expense entry form: name, amount, and category (dropdown with predefined categories).

3. **Category Management**:
   - Separate page for adding and editing categories.

4. **Weekly Summary**:
   - View total expenses for the current week.
   - Pie chart visualization of expenses by category.
   - Display weekly savings (if a weekly budget is set).

5. **Data Export**:
   - Export weekly expenses to Excel format.

6. **Mobile-Friendly**:
   - Optimized interface for mobile devices.
   - Quick expense entry from mobile devices.

7. **Restrictions**:
   - Prevents adding expenses for future dates.
   - Only the current week is accessible for expense entry.

## Technologies Used

- **Frontend**: Angular.
- **Backend**: Firebase (Firestore for data storage, Firebase Authentication for authentication).
- **Other Tools**: Chart.js for the Pie Chart, XLSX  for Excel export.

---

## How to Set Up and Run the Project

### 1. Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v16 or higher recommended).
- **Angular CLI** (install globally using `npm install -g @angular/cli`).
- A Firebase project set up in the [Firebase Console](https://console.firebase.google.com/).

### 2. Clone the Repository
```bash
git clone https://github.com/AdrianS2002/ExpenseTracker.git
cd expense-tracker
```

### 3. Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install
npm install firebase @angular/fire
npm install xlsx
```

### 4. Set Up Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (or use an existing one).
3. Add a web app to your Firebase project and copy the Firebase configuration.
4. Update the Firebase configuration in `src/app/main.ts`:
   ```typescript
   const firebaseConfig = {
     production: false,
     firebase: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     }
   };
   ```

### 5. Enable Firebase Authentication and Firestore
1. In the Firebase Console, go to **Authentication** and enable **Email/Password** sign-in.
2. Go to **Firestore Database** and create a new database in **test mode** (for development purposes).

### 6. Run the Application
Start the development server:
```bash
ng serve
```
Open your browser and navigate to `http://localhost:4200`.

---

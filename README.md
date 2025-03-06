# Expense Tracker Web Application

## Overview
This is a responsive expense tracking web application that allows users to manage their daily expenses. It features a user-friendly interface for mobile and desktop devices, secure user authentication, and an intuitive system for tracking expenses for the current week.

## Key Features
- Two public pages with the rest of the application protected by authentication
- User authentication (signup, login, password reset)
- Mobile-responsive design for easy expense entry on smartphones
- Current week focus with dynamic day unlocking
- Prevention of future expense entries
- Daily expense listing with delete functionality
- Weekly expense summary view
- Expense categories management
- Simple expense entry form (name, amount, category)

## Technology Stack
- Angular
- Database & Authentication: Firebase

## Pages & Components
1. **Public Pages**:
   - Home
   - Auth
   - Forgot Password

2. **Protected Pages**:
   - Expenses Tracker
   - Summary

## Usage Guide

### Authentication
- Users must create an account to access the expense tracking features
- Password reset functionality is available via email

### Adding Expenses
- Navigate to the Expenses Tracker
- Select the current day (only current and past days of the current week are enabled)
- Fill the expense form with:
  - Expense name
  - Amount
  - Category (selected from dropdown)
- Submit to add the expense

# BEES Frontend Challenge

![BEES Frontend Challenge](https://img.shields.io/badge/BEES-Frontend%20Challenge-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue)
![Tests](https://img.shields.io/badge/Tests-Jest%20%7C%20RTL%20%7C%20Cypress-green)

A brewery discovery application built with Next.js and TypeScript for the BEES frontend technical assessment.

## 📋 Table of Contents

- Features
- Tech Stack
- Project Structure
- Getting Started
- Testing
- Implementation Details
- Additional Features

## ✨ Features

- **Authentication**: Simple login screen with name validation
- **Dashboard**: View and manage favorite breweries
- **Search**: Find breweries using the Open Brewery DB API
- **Favorites Management**: Add/remove breweries from favorites
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Persisted State**: User session and favorites persist through browser refresh

## 🚀 Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Testing**:
  - Unit & Integration: Jest + React Testing Library
  - E2E: Cypress

## 📁 Project Structure

```
├── app/                          # Next.js application code
│   ├── authentication/           # Authentication pages
│   ├── dashboard/                # Dashboard pages and components
│   │   ├── components/           # Dashboard-specific components
│   │   │   ├── BreweryCard/      # Brewery card component
│   │   │   ├── FavoriteBrewerySection/
│   │   │   └── SearchBrewerySection/
│   ├── components/               # Shared components
│   │   ├── Alert/                # Alert component
│   │   ├── Button/               # Button component
│   │   ├── Checkbox/             # Checkbox component
│   │   ├── Input/                # Input component
│   │   └── Navbar/               # Navigation component
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API services
│   ├── store/                    # Context providers and state management
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── cypress/                      # Cypress E2E tests
├── public/                       # Static assets
└── middleware.ts                 # Next.js middleware for auth protection
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/raulbana/bees-frontend-interview.git
   cd bees-frontend-interview
   ```

2. Install dependencies:
   ```bash
   npm install

   ```

3. Run the development server:
   ```bash
   npm run dev

   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧪 Testing

### Running Unit and Integration Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Running E2E Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run

# Run both unit tests and E2E tests
npm run test:all
```

## 🔍 Implementation Details

### Authentication

- Simple authentication using user's full name
- Form validation ensures proper name format (first and last name)
- Age verification checkbox required
- Session persistence using localStorage

### State Management

- User context for managing authentication state and user data
- Brewery context for managing brewery search results and favorites
- All state persists through page refreshes via localStorage

### API Integration

- Integration with Open Brewery DB API for searching breweries
- Error handling for failed API requests
- Loading states during API calls

### Component Architecture

- Reusable UI components (Button, Input, Alert, etc.)
- Section-specific components for dashboard
- Custom hooks for business logic separation

## 🌟 Additional Features

- **Persistent Sessions**: User data and favorites are stored in localStorage
- **Comprehensive Testing**: Unit, integration, and E2E tests covering major application flows
- **Responsive Design**: Mobile-first approach with tailored layouts for different screen sizes
- **Error Handling**: User-friendly error messages and fallbacks
- **Form Validation**: Comprehensive validation using Zod and React Hook Form
- **Accessibility**: Semantic HTML and proper ARIA attributes

## 📝 Development Decisions

### Why Next.js?

Next.js was chosen for its built-in performance optimizations, routing capabilities, and developer experience. The App Router provides a clean way to organize the application by features.

### State Management Approach

React Context was chosen over more complex state management libraries due to the relatively simple state requirements of the application. This approach keeps the codebase lightweight while maintaining good separation of concerns.

### Testing Strategy

- **Unit Tests**: Focus on individual components and hooks
- **Integration Tests**: Test interactions between components
- **E2E Tests**: Verify complete user flows from login to brewery management

### Styling Approach

Tailwind CSS was used for rapid development and consistent styling. The utility-first approach allows for quick iterations and responsive design without context switching between CSS and JSX files.

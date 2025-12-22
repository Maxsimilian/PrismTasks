# PrismTasks

> A modern, full-stack task management application built with FastAPI and Next.js

[![Tests](https://img.shields.io/badge/tests-57%20passing-brightgreen)](https://github.com/Maxsimilian/PrismTasks)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2015-black)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Overview

PrismTasks is a personal full-stack project built to explore and demonstrate modern web development practices.
The goal was to design and implement a realistic, production-style application with a strong focus on security, performance, testing, and overall code quality.

## 🎯 Key Features

- **🔐 Secure Authentication** - Argon2 password hashing with HttpOnly cookies
- **📋 Smart Task Management** - Priority levels, categories, and optimistic UI updates
- **🌙 Beautiful Dark Mode** - System preference detection with smooth transitions
- **📱 Fully Responsive** - Seamless experience across desktop, tablet, and mobile
- **⚡ Optimistic Updates** - Instant UI feedback with automatic rollback on errors
- **🧪 Professional Testing** - 31 frontend + 26 backend tests (100% pass rate)
- **♿ Accessibility First** - ARIA labels, keyboard navigation, and focus management

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first styling with `@theme` directive
- **React Hook Form + Zod** - Type-safe form validation
- **Axios** - HTTP client with interceptors
- **Vitest + React Testing Library** - Component and integration testing

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Powerful ORM with type hints
- **PostgreSQL** - Production-ready database
- **Alembic** - Database migration management
- **pytest** - Comprehensive API testing
- **Argon2** - Industry-standard password hashing

## 📋 Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.11+
- **PostgreSQL** 14+ (or SQLite for development)

## 🛠️ Quick Start

### Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server (http://localhost:8000)
uvicorn backend.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server (http://localhost:3000)
npm run dev
```

## 🧪 Testing

### Frontend Tests (31 passing)

```bash
cd frontend

npm test              # Run all tests
npm run test:coverage # Generate coverage report
npm run test:ui       # Interactive test UI
```

**Coverage**: Components, hooks, authentication flows, and user interactions

### Backend Tests (26 passing)

```bash
pytest backend/tests/ -v                    # Run all tests
pytest backend/tests/ --cov=backend -v      # With coverage
pytest backend/tests/test_auth.py -v        # Specific test file
```

**Coverage**: Authentication, CRUD operations, user isolation, and security

## 🏗️ Architecture Decisions

### Tailwind CSS v4
This project uses **Tailwind CSS v4** for its performance improvements and streamlined workflow:
- **Theme Configuration**: Entirely in `src/app/globals.css` using the `@theme` directive
- **Design Tokens**: Defined in `:root` as CSS variables (e.g., `--background`, `--primary`)
- **Single Source of Truth**: No `tailwind.config.js` needed

### Authentication Strategy
- **HttpOnly Cookies**: Backend sets secure, httpOnly `access_token` cookie
- **Axios Configuration**: `withCredentials: true` for cookie transmission
- **401 Handling**: Automatic logout and redirect via Axios interceptor
- **OAuth2 Compliance**: Login uses `application/x-www-form-urlencoded` format

### Optimistic UI
Task operations update the UI immediately for instant feedback:
- **Success**: Changes persist
- **Failure**: Automatic rollback with error toast
- **Offline**: Graceful degradation with clear user feedback

## 📁 Project Structure

```
PrismTasks/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── routers/             # API endpoints
│   │   ├── auth.py          # Authentication routes
│   │   ├── todos.py         # Todo CRUD operations
│   │   └── users.py         # User management
│   └── tests/               # Backend test suite
│       ├── conftest.py      # Test fixtures
│       ├── test_auth.py     # Authentication tests
│       └── test_todos.py    # Todo API tests
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   ├── (dashboard)/ # Protected dashboard
│   │   │   ├── privacy/     # Privacy policy
│   │   │   └── terms/       # Terms of service
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── __tests__/   # Component tests
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── __tests__/   # Hook tests
│   │   ├── context/         # React Context providers
│   │   ├── lib/             # Utilities and API client
│   │   └── test/            # Test configuration
│   ├── vitest.config.ts     # Vitest configuration
│   └── package.json
├── alembic/                 # Database migrations
├── .github/workflows/       # CI/CD pipeline
├── .gitignore
├── requirements.txt
├── pyproject.toml           # pytest configuration
└── README.md
```

## 🔒 Security Features

- **Argon2 Password Hashing** - Memory-hard algorithm resistant to GPU attacks
- **HttpOnly Cookies** - XSS attack prevention
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Zod schemas (frontend) + Pydantic models (backend)
- **SQL Injection Protection** - Parameterised queries via SQLAlchemy ORM
- **User Isolation** - Row-level security ensuring users only access their data

## 🎨 User Experience

### UI Polish
- **Premium Landing Page** - Feature showcase with "How it Works" section
- **Dashboard Momentum** - Progress tracking with visual stats
- **Micro-interactions** - Smooth transitions and hover effects
- **Smart Empty States** - Actionable prompts with quick-add buttons
- **Loading States** - Skeleton screens prevent content flicker

### Accessibility
- **Keyboard Navigation** - Full keyboard support with focus trapping in modals
- **Screen Reader Support** - Semantic HTML and ARIA labels throughout
- **Focus Management** - Visible focus rings on all interactive elements
- **ESC Key Support** - Close modals and dialogs naturally

## 🚦 API Endpoints

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/token` - Login (returns HttpOnly cookie)
- `POST /auth/logout` - Clear session
- `GET /user/get_user` - Retrieve current user details

### Todos
- `GET /todos/` - List all user's todos
- `POST /todos/` - Create new todo
- `GET /todos/{id}` - Get specific todo
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

## ✅ QA Checklist

When modifying the application, verify:
- [ ] **Login Flow** - Correct `application/x-www-form-urlencoded` format
- [ ] **Session Persistence** - HttpOnly cookie survives page refresh
- [ ] **CRUD Operations** - Create, edit, and delete tasks successfully
- [ ] **Optimistic UI** - Toggle/edit offline shows rollback behaviour
- [ ] **Profile Updates** - User details persist after changes
- [ ] **Dark Mode** - Theme toggles and persists in localStorage
- [ ] **Responsive Design** - Works on mobile, tablet, and desktop
- [ ] **Accessibility** - Keyboard navigation and screen reader support

## 📊 Testing Philosophy

This project demonstrates professional testing practices:

- **Unit Tests** - Individual components and functions
- **Integration Tests** - API endpoints and authentication flows
- **Component Tests** - User interactions and state management
- **Security Tests** - Password hashing and user isolation
- **100% Pass Rate** - All tests maintained and passing

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Write tests for new functionality
4. Ensure all tests pass (`npm test` and `pytest`)
5. Commit with clear messages (`git commit -m 'Add AmazingFeature'`)
6. Push to your branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Max**
- GitHub: [@Maxsimilian](https://github.com/Maxsimilian)
- Email: arwock@protonmail.com

## 🙏 Acknowledgements

Built with excellent open-source tools:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vitest](https://vitest.dev/) - Lightning-fast unit testing
- [pytest](https://pytest.org/) - Python testing framework

---

**Built with ❤️ for productivity and professional development**

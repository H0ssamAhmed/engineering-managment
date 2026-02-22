# 🏗️ Engineering Management ERP

A professional, full-featured ERP system designed for engineering consultancy and contracting firms. Built with **React**, **Vite**, **TypeScript**, and **Supabase**, this platform streamlines project management, client relations, and multi-disciplinary engineering workflows.

---

## ✨ Key Features

- **🚀 Project Lifecycle Management**: Track projects from "Surveying" through "Architectural Design" to "Mechanical Design" and "Baladi Submission".
- **👥 Multi-Role Workspace**: Tailored interfaces for Managers, Architects, Designers, Surveyors, and Submitters.
- **📁 Document & Path Tracking**: Integrated server path management for physical/network file organization.
- **📅 Dynamic Workflows**: Custom workflow templates mapped to project types (e.g., Building Permits).
- **📊 Real-time Dashboard**: Overview of active projects, upcoming deadlines, and team performance.
- **🤝 Client Portal**: Manage client information and project associations seamlessly.
- **🔒 Secure Authentication**: Robust RBAC (Role-Based Access Control) powered by Supabase Auth.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI Primitives)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend & Infrastructure
- **BaaS**: [Supabase](https://supabase.com/) (Database, Auth, Edge Functions)
- **Database**: PostgreSQL
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```text
src/
├── api/          # Supabase API services (projects, users, clients)
├── components/   # Atomic UI components and feature-specific blocks
├── contexts/     # React Contexts for global state (e.g., Auth)
├── hooks/        # Custom React hooks for business logic
├── lib/          # Utilities (Supabase client, CN helper)
├── pages/        # Main application views (Dashboard, Projects, etc.)
└── types/        # TypeScript interfaces and enums
```

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd "engineering managment"
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Initialization
1.  Go to your **Supabase Dashboard** -> **SQL Editor**.
2.  Run the contents of [seed.sql](file:///Users/hossamahmed/Desktop/Hossam/Projects/engineering%20managment%20/seed.sql) to initialize tables and sample data.

### 4. Run Locally
```bash
npm run dev
```

---

## 🔐 Authentication & Roles

Refer to [AUTH_SETUP.md](file:///Users/hossamahmed/Desktop/Hossam/Projects/engineering%20managment%20/AUTH_SETUP.md) for detailed setup instructions.

### User Roles:
| Role | Description |
| :--- | :--- |
| **MANAGER** | Full system access, team management, and project oversight. |
| **ARCHITECT** | Project design and technical drawing management. |
| **SURVEYOR** | Initial site data collection and surveying logs. |
| **MECHANICAL** | Mechanical systems design and integration. |
| **SUBMITTER** | Handling official "Baladi" platform submissions. |

---

## 📊 Database Schema Summary

The system utilizes several core tables:
- `clients`: Company and individual client details.
- `projects`: Primary project data (Plot #, location, type).
- `project_stages`: Specific lifecycle steps for each project.
- `workflow_templates`: Predefined stages based on project type.
- `project_logs`: Audit trail and status updates.

---

## 📜 Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint checks.
- `npm run preview`: Locally preview production build.

<div align="center">

# 🌊 WellTrack

### _Design your life. Small habits. Big clarity._

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[🚀 Live Demo](https://wellness-tracker-backend-4if1.onrender.com)** | Try instantly — no signup needed

</div>

---

## 🧭 What Is WellTrack?

WellTrack is a **full-stack personal wellness tracking application** built for people who want to take control of their daily habits — sleep, nutrition, mental wellness, and morning rituals — all in one place.

It's not just another habit tracker. WellTrack gives you:

- **A real health score** calculated from actual data you log every day
- **Streak tracking** to keep your momentum alive
- **AI-style insights** generated from your historical data trends
- **An admin view** so teams or coaches can view analytics across multiple users
- **CSV export** for any data range so you always own your data
- **Demo mode** so anyone can explore the app without creating an account

---

## 🎯 Who Is This For?

| User Type                           | Why WellTrack?                                                       |
| ----------------------------------- | -------------------------------------------------------------------- |
| 🏃 **Health-conscious individuals** | Track sleep, calories, mood, and rituals in one place                |
| 🧘 **Wellness enthusiasts**         | Build and sustain morning rituals with scoring                       |
| 📊 **Data-driven people**           | Download CSV exports, view trend charts, get insights                |
| 🏫 **Coaches / Admins**             | Monitor multiple users' wellness data side-by-side                   |
| 👩‍💻 **Developers**                   | Explore a full-stack MERN app with auth, analytics, and Swagger docs |

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based authentication** — stateless, secure, with 7-day token expiry
- **Google OAuth 2.0** — one-click login with your Google account
- **Email verification** — optional, non-blocking (users can log in without verifying)
- **Forgot/Reset password** — secure token-based reset via email (1-hour expiry)
- **Role-based access control** — `user` and `admin` roles enforced at middleware level
- **Bcrypt password hashing** — all passwords hashed with salt rounds of 10

### 😴 Sleep Tracker

- Log your **planned** and **actual** sleep/wake times separately
- Auto-calculates **sleep hours** from actual sleep and wakeup timestamps
- Computes a **Sleep Consistency Score** (0–10) based on how close your actual times match your planned times
  - Within 30 min → Score: 10
  - 30–60 min deviation → Score: 7
  - 60–120 min deviation → Score: 4
  - Over 120 min → Score: 1
- **Streak tracking** — consecutive days with a sleep entry logged
- One entry per user per day (unique constraint enforced at DB level)

### 🍎 Nutrition Tracker

- **Goal types**: Cut / Bulk / Maintain — each scored differently
- Track **calories, protein, and water** (target vs actual for each)
- Composite **Nutrition Score** = Calories (50%) + Protein (30%) + Water (20%)
- **Cut scoring** rewards hitting just below target; **Bulk scoring** rewards hitting at or above target
- Weight logging (optional)
- One entry per user per day

### 🧠 Mental Wellness Tracker

- Log **meditation minutes**, **breathing sessions**, and **mood** (1–5 scale)
- Auto-computes a **Wellness Score**:
  - Meditation: 0–20 min → 0–10 pts
  - Breathing sessions: 0–10+ → 0–10 pts
  - Mood × 2 = mood score
- Mood emoji support
- One entry per user per day

### 🔥 Morning Ritual Tracker

- Create a **fully custom** morning ritual with any activities you want
- Three activity types supported:
  - **Yes/No** — did you do it or not?
  - **Numeric** — e.g., "10 push-ups" — scored proportionally to goal
  - **Time** — e.g., "Wake up by 6:00 AM" — scored by deviation from goal
- **Add, update, and delete** individual activities within a ritual
- **Total Ritual Score** auto-recalculates every time an activity is updated or deleted
- Ritual is created lazily (only created when first activity is added)

### 📊 Dashboard

- **Today's snapshot** showing:
  - Health Score (sum of sleep + ritual + wellness scores)
  - Sleep hours & consistency score
  - Calories consumed vs target
  - Mood rating
  - Meditation minutes
  - Sleep streak, calorie streak, mood streak
- Cards are clickable — navigate directly to each tracker
- **Demo fallback** for demo users — realistic random data is shown if no real entries exist for today, so the demo experience is never blank

### 📈 Analytics (My Analytics — User View)

- Line charts for **sleep, calories, and mood** over 7 / 15 / 30 day ranges
- **Insights engine** — generated locally from your actual data:
  - Detects trends (improving / declining / stable)
  - Flags averages above/below healthy thresholds
  - Works with as few as 1 data entry
- All days in range shown — null values for days with no entry (no gaps in the chart axis)
- **CSV export** with date prefix formatted correctly for Excel (apostrophe trick so dates don't become `######`)

### 🛡️ Admin Dashboard

- Admin-only route, protected at both middleware and route level
- View **all users**, their roles, join dates
- **Multi-user analytics charts** — select up to 5 users and compare their sleep, calories, and mood side by side
- **Per-user analytics** page with 3 separate charts (one per metric) each with their own insight panel
- **Admin CSV export** includes all selected users' data labeled by name, not by internal ID
- **Stats endpoint** — total users, verified users, admin count, new signups today

### 🔄 Streak Tracking

- Sleep streak: consecutive days with a sleep entry
- Calorie streak: consecutive days with `actualCalories` logged
- Mood streak: consecutive days with a `mood` value logged
- Streaks calculated from full entry history, not just recent data

### 📬 Email Service

- **Verification email** on signup (non-blocking — signup always succeeds even if email fails)
- **Password reset email** with 1-hour expiry link
- Styled HTML email template with WellTrack branding

### 📃 Swagger API Documentation

- Full OpenAPI 3.0 docs auto-generated from JSDoc comments in routes
- Available at `/api-docs` on the deployed backend
- Covers all route groups: Auth, Dashboard, Sleep, Nutrition, Mental, Ritual, Admin

---

## 🏗️ Architecture

```
WellTrack/
│
├── backend/                    # Express.js REST API
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── passport.js         # Google OAuth strategy
│   │   └── swagger.js          # Swagger/OpenAPI config
│   │
│   ├── controllers/            # Route handlers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── mentalWellnessController.js
│   │   ├── nutritionController.js
│   │   ├── ritualController.js
│   │   └── sleepController.js
│   │
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── admin.js            # Role check
│   │
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── SleepEntry.js
│   │   ├── NutritionEntry.js
│   │   ├── mentalWellnessEntry.js
│   │   └── MorningRitual.js    # with embedded activitySchema
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── sleep.js
│   │   ├── nutrition.js
│   │   ├── mental.js
│   │   ├── ritual.js
│   │   └── admin.js
│   │
│   ├── services/               # Business logic
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── sleepService.js
│   │   ├── nutritionService.js
│   │   ├── mentalWellnessService.js
│   │   ├── ritualService.js
│   │   ├── streakService.js
│   │   ├── insightService.js
│   │   └── emailService.js
│   │
│   └── constants/              # Enums and shared values
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx         # Animated landing page
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Sleep.jsx
    │   │   ├── Nutrition.jsx
    │   │   ├── Wellness.jsx
    │   │   ├── Ritual.jsx
    │   │   ├── Profile.jsx
    │   │   ├── UserAnalytics.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Users.jsx
    │   │   └── UserDetails.jsx
    │   │
    │   ├── components/
    │   │   └── layout/
    │   │       ├── Sidebar.jsx
    │   │       ├── Navbar.jsx
    │   │       └── Dashboard.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   │
    │   ├── services/
    │   │   ├── api.js              # Axios instance with interceptors
    │   │   └── authService.js
    │   │
    │   └── utils/
    │       └── exportCSV.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A Gmail account (for email features — optional)
- A Google Cloud project (for Google OAuth — optional)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/welltrack.git
cd welltrack
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/wellness_tracker
# or your Atlas URI:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wellness_tracker

# JWT
JWT_SECRET=your_super_secret_key_here

# Google OAuth (optional — skip if not using Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (optional — skip if not using email features)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Gmail Setup for Email:** Go to Google Account → Security → App Passwords → Generate one for "Mail". Use that as `EMAIL_PASS`, not your regular password.

Start the backend:

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

> Make sure the frontend API base URL in `src/services/api.js` points to `http://localhost:5000` for local development (change from the deployed URL).

---

### 4. (Optional) Create an Admin User

After signing up normally, open MongoDB Compass or the Mongo shell and manually update your user's role:

```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } });
```

---

## 🔑 Environment Variables Reference

| Variable               | Required    | Description                      |
| ---------------------- | ----------- | -------------------------------- |
| `MONGO_URI`            | ✅ Yes      | MongoDB connection string        |
| `JWT_SECRET`           | ✅ Yes      | Secret key for signing JWTs      |
| `GOOGLE_CLIENT_ID`     | ⚠️ Optional | For Google OAuth login           |
| `GOOGLE_CLIENT_SECRET` | ⚠️ Optional | For Google OAuth login           |
| `EMAIL_USER`           | ⚠️ Optional | Gmail address for sending emails |
| `EMAIL_PASS`           | ⚠️ Optional | Gmail App Password               |

---

## 🗺️ API Routes

### Auth (`/api/auth`)

| Method | Route                    | Description           | Auth   |
| ------ | ------------------------ | --------------------- | ------ |
| POST   | `/signup`                | Register new user     | No     |
| POST   | `/login`                 | Login                 | No     |
| GET    | `/verify-email?token=`   | Verify email          | No     |
| POST   | `/forgot-password`       | Send reset email      | No     |
| POST   | `/reset-password?token=` | Reset password        | No     |
| GET    | `/me`                    | Get profile           | ✅ JWT |
| PUT    | `/me`                    | Update profile        | ✅ JWT |
| GET    | `/google`                | Start Google OAuth    | No     |
| GET    | `/google/callback`       | Google OAuth callback | No     |

### Dashboard (`/api/dashboard`)

| Method | Route           | Description                  | Auth   |
| ------ | --------------- | ---------------------------- | ------ |
| GET    | `/`             | Today's summary + streaks    | ✅ JWT |
| GET    | `/my-analytics` | Historical charts + insights | ✅ JWT |

### Sleep (`/api/sleep`)

| Method | Route  | Description        |
| ------ | ------ | ------------------ |
| POST   | `/`    | Create sleep entry |
| GET    | `/`    | Get all entries    |
| PUT    | `/:id` | Update entry       |
| DELETE | `/:id` | Delete entry       |

### Nutrition (`/api/nutrition`) | Mental (`/api/mental`) — same CRUD pattern

### Ritual (`/api/ritual`)

| Method | Route                       | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/`                         | Create ritual          |
| GET    | `/:date`                    | Get ritual for a date  |
| PUT    | `/:id/activity/:activityId` | Update activity        |
| DELETE | `/:id/activity/:activityId` | Delete activity        |
| POST   | `/:id/activity`             | Add activity to ritual |

### Admin (`/api/admin`) — requires `admin` role

| Method | Route                  | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | `/dashboard`           | All data overview     |
| GET    | `/users`               | All users list        |
| GET    | `/users/:id`           | Single user details   |
| GET    | `/stats`               | Platform stats        |
| GET    | `/analytics`           | Multi-user analytics  |
| GET    | `/users/:id/analytics` | Single user analytics |

---

## 🧪 Demo Mode

WellTrack ships with two built-in demo accounts accessible from the landing page:

| Account    | Email          | Password | Role  |
| ---------- | -------------- | -------- | ----- |
| Demo User  | demo@user.com  | 123456   | user  |
| Demo Admin | demo@admin.com | 123456   | admin |

These accounts generate **realistic synthetic data** for any days without real entries, so the dashboard, charts, and insights are always populated and meaningful — never blank.

---

## 🔍 Things We Took Extra Care Of

These are the non-obvious, behind-the-scenes decisions that make WellTrack robust:

### Data Integrity

- ✅ **Unique indexes** on `(userId, date)` for every tracker model — prevents duplicate entries at the database level, not just the application level
- ✅ **Defensive streak calculation** — wrapped in try/catch so a streak error never crashes the dashboard response

### Auth Edge Cases

- ✅ **Email verification is non-blocking** — signup always succeeds even if the email service fails; error is caught and logged, user is created
- ✅ **Login allowed without email verification** — unverified users can log in; they receive a message indicating their verification status
- ✅ **Bearer token normalization** — the auth middleware strips `"Bearer "` prefix if present, so both `Bearer <token>` and raw `<token>` work

### Analytics & Charts

- ✅ **Full date range always returned** — even days with no entries are included in analytics responses with `null` values, so chart axes are always complete and consistent
- ✅ **Demo fallback uses unique-per-day randomization** — each day gets its own random seed so the chart doesn't show flat lines
- ✅ **Insights work from 1 entry** — lowered threshold so users see feedback immediately, not only after accumulating a week of data
- ✅ **CSV date columns prefixed with apostrophe** — prevents Excel from treating ISO date strings as numbers and showing `##########`

### Admin Multi-User Charts

- ✅ **Max 5 users enforced** — only 5 colors are defined; selecting more would break chart legend
- ✅ **User name used as chart key** — not userId, so CSV headers and chart legends are human-readable
- ✅ **Apply button pattern** — user selections are staged, not immediately applied, to prevent chart re-renders on every checkbox click

### Frontend

- ✅ **Auth context persists across refresh** — `user` state is initialized from `localStorage` on mount
- ✅ **Axios interceptor** — auth token automatically attached to every request, no manual header setting per page
- ✅ **Signup success shown in modal** — not `alert()`, so users get a nicer experience and can read the full message before being redirected

### Scoring Systems

- ✅ **Cut vs Bulk vs Maintain** nutrition scoring — each goal type rewards different calorie ratios, not a one-size-fits-all system
- ✅ **Ritual score recalculates on every activity change** — delete an activity, score drops immediately; update a value, score updates instantly
- ✅ **Sleep consistency uses average of sleep AND wake deviations** — not just one of them

---

## 🛠️ Tech Stack

### Backend

| Package                                | Purpose                                |
| -------------------------------------- | -------------------------------------- |
| `express`                              | HTTP server and routing                |
| `mongoose`                             | MongoDB ODM                            |
| `jsonwebtoken`                         | JWT creation and verification          |
| `bcryptjs`                             | Password hashing                       |
| `passport` + `passport-google-oauth20` | Google OAuth                           |
| `nodemailer`                           | Email sending                          |
| `crypto` (built-in)                    | Token generation for email/reset flows |
| `swagger-jsdoc` + `swagger-ui-express` | API documentation                      |

### Frontend

| Package               | Purpose                       |
| --------------------- | ----------------------------- |
| `react` + `react-dom` | UI framework                  |
| `react-router-dom`    | Client-side routing           |
| `axios`               | HTTP client with interceptors |
| `recharts`            | Line charts for analytics     |
| `tailwindcss`         | Utility-first styling         |
| `vite`                | Build tool and dev server     |

---

## 📁 How to Add a README to GitHub

If you haven't already added this file to your repo:

```bash
# 1. Place README.md in the root of your project
cp README.md /path/to/your/project/README.md

# 2. Stage it
git add README.md

# 3. Commit it
git commit -m "docs: add comprehensive README"

# 4. Push to GitHub
git push origin main
```

GitHub automatically renders `README.md` on your repository's home page. It supports the full Markdown spec including tables, code blocks, badges, and images.

**Tips for a great GitHub repo page:**

- Add a screenshot or GIF of the app to the README (use `![alt text](path/to/image.png)`)
- Fill in `YOUR_USERNAME` in the clone URL above with your actual GitHub username
- Set repository topics on GitHub (e.g., `react`, `nodejs`, `wellness`, `mern`) — this helps discoverability
- Consider pinning the repo to your GitHub profile

---

## 📸 Screenshots

> _(Add your own screenshots here — landing page, dashboard, analytics, admin view)_

```markdown
![Landing Page](./screenshots/landing.png)
![Dashboard](./screenshots/dashboard.png)
![Analytics](./screenshots/analytics.png)
![Admin View](./screenshots/admin.png)
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ over 20 days of hard work.

_Track everything. Miss nothing._

</div>

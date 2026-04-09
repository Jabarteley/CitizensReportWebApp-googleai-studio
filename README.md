# Citizen Crisis Reporting System (CCRS)

A full-stack web application for citizens to report crises and for authorities to manage emergency responses in real-time.

## 🚀 Features

- **User Authentication**: Google Sign-In, Email/Password, Anonymous reporting
- **Crisis Reporting**: Quick form with auto-location, media upload, urgency levels
- **Real-Time Map**: Interactive Leaflet map with color-coded crisis markers
- **AI Analysis**: Google Gemini AI for spam detection, severity scoring, and summarization
- **Admin Dashboard**: Full CRUD operations, status management, filtering, and AI insights
- **Responsive Design**: Mobile-first Tailwind CSS UI

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│  Components:                                                 │
│  ├─ HomePage (Landing page with features)                   │
│  ├─ LoginPage (Auth: Google, Email, Anonymous)              │
│  ├─ CrisisReportForm (Report submission)                    │
│  ├─ CrisisMap (Leaflet interactive map)                     │
│  ├─ AdminDashboard (Management interface)                   │
│  └─ Navbar (Navigation)                                     │
│                                                              │
│  Services:                                                   │
│  ├─ authService (Firebase Auth wrappers)                    │
│  ├─ reportService (Firestore CRUD)                          │
│  └─ gemini.js (Google AI integration)                       │
│                                                              │
│  Context:                                                    │
│  └─ AuthContext (Global auth state)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Firebase)                        │
├─────────────────────────────────────────────────────────────┤
│  Firebase Authentication:                                    │
│  ├─ Google OAuth                                            │
│  ├─ Email/Password                                          │
│  └─ Anonymous Auth                                          │
│                                                              │
│  Firestore Database:                                         │
│  ├─ /reports/{reportId}                                     │
│  │   ├─ userId, type, description, location                 │
│  │   ├─ mediaUrl, urgency, status                           │
│  │   ├─ aiAnalysis { spam, severity, summary }              │
│  │   └─ createdAt, updatedAt, isFlagged                     │
│  └─ /users/{userId}                                         │
│      ├─ displayName, email, role                            │
│      └─ provider, lastLogin                                 │
│                                                              │
│  Firebase Storage:                                           │
│  └─ /reports/{userId}/{fileName}                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI LAYER (Gemini API)                      │
├─────────────────────────────────────────────────────────────┤
│  Functions:                                                  │
│  ├─ analyzeReport() - Spam detection, severity, summary     │
│  ├─ summarizeReport() - Public-facing summaries             │
│  └─ analyzeImage() - Media content verification             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd citizen-crisis-report
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔐 Firebase Setup

### 1. Enable Authentication
- Go to Firebase Console > Authentication
- Enable **Google**, **Email/Password**, and **Anonymous** sign-in

### 2. Create Firestore Database
- Start in **test mode** initially
- Deploy the security rules from `firestore.rules`

### 3. Enable Storage
- Go to Firebase Console > Storage
- Deploy the security rules from `storage.rules`

### 4. Deploy Security Rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

## 🗄️ Firestore Schema

### Collection: `reports`
```typescript
{
  id: string;
  userId: string;                  // User ID or 'anonymous'
  type: 'violence' | 'accident' | 'fire' | 'kidnapping' | 'medical' | 'other';
  description: string;             // Max 1000 chars
  location: {
    lat: number;                   // Latitude
    lng: number;                   // Longitude
    address: string;               // Human-readable address
  };
  mediaUrl: string | null;         // Firebase Storage URL
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'in-progress' | 'resolved';
  aiAnalysis: {
    isSpam: boolean;
    spamConfidence: number;        // 0-1
    severityScore: number;         // 0-1
    correctedCategory: string;
    summary: string;
    recommendedAction: string;
    keyEntities: string[];
    sentiment: 'urgent' | 'concerning' | 'informative';
  } | null;
  isFlagged: boolean;              // Manually flagged by admin
  flags: number;                   // Number of flags
  createdAt: Timestamp;
  updatedAt: Timestamp;
  analyzedAt: Timestamp | null;
}
```

### Collection: `users`
```typescript
{
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  provider: 'google' | 'email' | 'anonymous';
  role: 'citizen' | 'admin' | 'responder';
  isAnonymous: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}
```

## 🔒 Security Best Practices

### Implemented:
1. **Firestore Rules**: Restrict write operations to authenticated users
2. **Storage Rules**: File size limits (10MB), content-type validation
3. **Environment Variables**: All secrets in `.env` (never commit)
4. **Input Validation**: Client-side validation before submission
5. **AI Spam Detection**: Automated flagging of suspicious reports
6. **Admin-Only Actions**: Delete/update restricted to admins

### Recommendations:
1. **Enable App Check**: Prevent abuse from unauthorized clients
2. **Rate Limiting**: Use Firebase App Check + Cloud Functions
3. **Audit Logging**: Track all admin actions
4. **Data Backup**: Enable automatic Firestore backups
5. **CORS Configuration**: Restrict to your domain in production

## 🤖 AI Integration (Gemini)

### Analysis Flow:
```
1. User submits report
2. Report saved to Firestore (immediate)
3. AI analysis triggered asynchronously
4. Results written back to same document
5. Admin dashboard shows AI insights
```

### Gemini Model: `gemini-2.0-flash`
- Fast response times (~1-2s)
- Cost-effective for high volume
- Supports text and image analysis

### Prompt Engineering:
- Structured JSON output for consistency
- Clear guidelines for severity scoring
- Spam detection with confidence levels

## 📱 Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | HomePage | Public | Landing page |
| `/login` | LoginPage | Public | Authentication |
| `/report` | CrisisReportForm | Public | Submit crisis report |
| `/map` | CrisisMap | Public | View live crisis map |
| `/dashboard` | AdminDashboard | Protected | Admin management |

## 🎨 Tech Stack

- **Frontend**: React 18, Vite, React Router v7
- **Styling**: Tailwind CSS 3
- **Maps**: Leaflet + React-Leaflet
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini API (via @google/generative-ai)
- **Deployment**: Firebase Hosting / Vercel / Netlify

## 🚀 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Firebase Hosting
firebase deploy
```

## 🔮 Future Enhancements

- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] SMS fallback (Twilio integration)
- [ ] Offline mode (service workers)
- [ ] Community upvotes/validation
- [ ] Heatmap visualization
- [ ] Multi-language support
- [ ] Export reports (CSV/PDF)
- [ ] Real-time alerts for responders
- [ ] Image AI moderation (Firebase Vision)

## 📄 License

MIT

## 👥 Support

For issues or questions, open an issue in the repository.

---

**Built with ❤️ for community safety**

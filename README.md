# ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძარი | Annunciation Cathedral

Full-stack ვებ-აპლიკაცია ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძრისთვის მრავალენოვანი მხარდაჭერით (ქართული/ინგლისური).

## 🚀 Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM
- Axios
- Vanilla CSS with custom design system

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## 📁 Project Structure

```
church-project/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # Uploaded images
│   ├── server.js        # Express server
│   └── .env             # Environment variables
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── utils/           # Utilities
│   └── index.css        # Global styles
└── index.html
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and Install

```bash
cd church-project

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Configure MongoDB

1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Create Admin User

After starting the backend, create an admin user by sending a POST request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password","role":"admin"}'
```

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## 📱 Features

### Public Pages
- **Home** - Hero section, mission preview, construction progress, recent photos
- **About** - Church history, mission, architecture, community info
- **Gallery** - Photo gallery with category filtering
- **Contact** - Contact information, form, bank details

### Admin Panel
- Login authentication
- Upload photos with multilingual titles/descriptions
- Manage gallery (view, delete photos)
- Category organization

### Multilingual Support
- Georgian (ქართული)
- English
- Language toggle in header
- Persistent language selection

## 🎨 Design Features

- Premium color palette with gradients
- Smooth animations and transitions
- Glassmorphism effects
- Responsive design (mobile-first)
- Custom typography (Inter + Noto Serif/Sans Georgian)
- Winter/Stone aesthetic matching the church's architectural rendering

## 🔐 API Endpoints

### Public
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get single item
- `GET /api/content` - Get content
- `POST /api/auth/login` - Login

### Protected (requires JWT)
- `POST /api/gallery` - Create gallery item
- `PUT /api/gallery/:id` - Update item
- `DELETE /api/gallery/:id` - Delete item
- `POST /api/content` - Create/update content

## 📦 Deployment

### Backend (Digital Ocean)
1. Create a Droplet or use App Platform
2. Set environment variables
3. Deploy backend code
4. Configure Nginx as reverse proxy

### Frontend
1. Build: `npm run build`
2. Deploy `dist` folder to static hosting
3. Update API URLs in production

## 🔧 Environment Variables

```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production

# Frontend (in production)
VITE_API_URL=https://your-api-domain.com
```

## 📝 License

© 2026 ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძარი. ყველა უფლება დაცულია.

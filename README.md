# UrbanEase

UrbanEase is a full-stack service booking web application built with a React frontend, an Express backend, and MongoDB database storage. The project includes user authentication, service browsing, booking, payments, contact queries, admin/provider dashboards, realtime updates, and a Team Detail feature for managing team member profiles.

## What This Project Does

- Users can register, login, view services, book services, and make payments.
- Service providers can manage their profile and see booking-related details.
- Admin users can manage dashboard data, contact queries, members, and platform information.
- Team Detail pages allow Team 13 member data to be added, stored, viewed, and opened as a full profile.
- Uploaded member images are stored in the backend `server/uploads/` folder and displayed by the frontend.
- MongoDB stores application data such as users, bookings, services, contacts, providers, and team members.

## Tech Stack

- Frontend: React, Vite, React Router DOM, Tailwind CSS, Lucide React
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Uploads: Multer
- Authentication: JWT and bcryptjs
- Payments: Razorpay
- Email: Nodemailer
- API communication: Fetch API and Axios

## Project Structure

```txt
urbaneasefinal/
  README.md
  client/
    src/
    public/
    package.json
    .env
  server/
    config/
    middleware/
    models/
    routes/
    uploads/
    utils/
    server.js
    package.json
    .env
```

## Required Software

Install these before running the project:

- Node.js
- npm
- MongoDB Community Server, or MongoDB Atlas
- Git, optional but useful

Check installation:

```powershell
node -v
npm -v
mongod --version
```

## Environment Files

### Frontend Environment

File location:

```txt
client/.env
```

Required value:

```env
VITE_API_URL=http://localhost:5000/api
```

What it does:

- The React app uses this value to call the backend API.
- If backend runs on port `5000`, keep this value unchanged.
- If backend port changes, update this URL also.

### Backend Environment

File location:

```txt
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urbanease
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
ADMIN_SECRET_KEY=your_admin_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=your_email@gmail.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

What these values do:

- `PORT`: backend server port.
- `MONGO_URI`: MongoDB database connection URL.
- `JWT_SECRET`: secret key used for login tokens.
- `JWT_EXPIRES_IN`: how long login tokens stay valid.
- `ADMIN_SECRET_KEY`: key used for admin-related access.
- `CLIENT_URL`: frontend URL allowed by CORS.
- `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: email sending configuration.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Razorpay payment configuration.

Do not share real `.env` secrets publicly.

### Email on Render

Render free web services block outbound SMTP traffic on ports `25`, `465`, and `587`. Gmail SMTP uses `465` or `587`, so Nodemailer can time out in production even when it works locally.

For Render free services, use an email provider with an HTTPS API such as Brevo. Add these backend environment variables in Render:

```env
EMAIL_PROVIDER=brevo_api
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM_NAME=UrbanEase
EMAIL_FROM_EMAIL=your_verified_sender@yourdomain.com
```

If you upgrade the Render backend to a paid instance, you can keep using SMTP instead:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_login
SMTP_PASS=your_brevo_smtp_key
EMAIL_FROM=UrbanEase <your_verified_sender@yourdomain.com>
```

## Install Dependencies

Run these commands from the main project folder.

### Install Frontend Dependencies

```powershell
cd client
npm install
```

What happens:

- npm reads `client/package.json`.
- It installs React, Vite, Tailwind, routing, icons, and frontend packages.
- A `node_modules` folder is created inside `client`.

### Install Backend Dependencies

Open a new terminal or go back to the main folder:

```powershell
cd ..
cd server
npm install
```

What happens:

- npm reads `server/package.json`.
- It installs Express, Mongoose, JWT, Multer, Razorpay, Nodemailer, and backend packages.
- A `node_modules` folder is created inside `server`.

## Start MongoDB

### Option 1: Local MongoDB

Start MongoDB service from Windows Services, or run:

```powershell
mongod
```

Use this backend database URL:

```env
MONGO_URI=mongodb://localhost:27017/urbanease
```

What happens:

- MongoDB starts locally on your system.
- The backend connects to database name `urbanease`.
- Collections are created automatically when data is inserted.

### Option 2: MongoDB Atlas

Use your Atlas connection string in `server/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster-url/urbanease
```

What happens:

- Backend connects to MongoDB Atlas instead of local MongoDB.
- Data is stored in the cloud database.

## Run The Project

You need two terminals: one for backend and one for frontend.

### Terminal 1: Run Backend

From the main project folder:

```powershell
cd server
node server.js
```

Backend URL:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

What happens:

- Express server starts.
- `.env` values are loaded.
- Backend connects to MongoDB using `MONGO_URI`.
- API routes become available under `/api`.
- Uploaded files become available from `/uploads`.

### Terminal 2: Run Frontend

From the main project folder:

```powershell
cd client
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

What happens:

- Vite starts the React development server.
- Browser opens the UrbanEase frontend.
- Frontend sends API requests to `http://localhost:5000/api`.

## Main Commands Summary

### Frontend

```powershell
cd client
npm install
npm run dev
```

Build frontend:

```powershell
npm run build
```

Preview frontend build:

```powershell
npm run preview
```

Run frontend lint:

```powershell
npm run lint
```

### Backend

```powershell
cd server
npm install
node server.js
```

### MongoDB

```powershell
mongod
```

## Important URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health check: `http://localhost:5000/api/health`
- Uploaded images: `http://localhost:5000/uploads/<filename>`

## API Routes

- `POST /api/auth/...` - authentication routes.
- `GET /api/services` - service routes.
- `POST /api/bookings` - booking routes.
- `POST /api/payment/create-order` - create Razorpay order.
- `POST /api/payment/verify` - verify Razorpay payment.
- `POST /api/contact` - contact query routes.
- `POST /api/members` - add team member with optional image.
- `GET /api/members` - get all team members.
- `GET /api/members/:id` - get one team member by ID.
- `GET /api/health` - check if backend is running.

## Team Detail Feature

The Team Detail feature manages Team 13 member information inside UrbanEase.

Pages:

- Team landing page: `/team`
- Add member page: `/team/add`
- View members page: `/team/members`
- Member details page: `/team/members/:id`

Flow:

1. User opens `/team`.
2. User clicks Add Member.
3. User fills name, roll number, year, degree, project details, hobbies, certificate, internship, aim, and photo.
4. Frontend sends a `POST /api/members` request with `multipart/form-data`.
5. Multer saves the uploaded image in `server/uploads/`.
6. MongoDB stores the member details and image filename.
7. View Members page calls `GET /api/members`.
8. Member Details page calls `GET /api/members/:id`.
9. Frontend displays the member photo using the backend uploads URL.

Important Team Detail files:

- `client/src/App.jsx`
- `client/src/pages/TeamPage.jsx`
- `client/src/pages/AddMemberPage.jsx`
- `client/src/pages/ViewMembersPage.jsx`
- `client/src/pages/MemberDetailsPage.jsx`
- `client/src/pages/teamPageStyles.js`
- `server/routes/members.js`
- `server/models/Member.js`
- `server/server.js`

## Image Upload And Display

Uploaded member images are saved here:

```txt
server/uploads/
```

Public image URL format:

```txt
http://localhost:5000/uploads/<filename>
```

Example:

```txt
server/uploads/member-photo.jpg
http://localhost:5000/uploads/member-photo.jpg
```

The frontend creates the image URL by taking the API URL and changing:

```txt
http://localhost:5000/api
```

into:

```txt
http://localhost:5000
```

Then it adds:

```txt
/uploads/<filename>
```

## Add Output Images In README

You can add screenshots/output images in this README using Markdown image syntax.

### If Image Is Inside This Project

Put your image in a folder such as:

```txt
server/uploads/
```

Then add it like this:

```md
![Landing Page](server/uploads/landingpage.png)
```

### If Image Is From A Link

Use this format:

```md
![Output Screenshot](https://your-image-link-here.com/image.png)
```

### Current Output Image Links

These images already exist in `server/uploads/`, so you can show them in README like this:

```md
![Landing Page](server/uploads/landingpage.png)
![Team Detail Page](server/uploads/teamdeatilpage.png)
![Add Member Page](server/uploads/addmember.png)
![View Detail Page](server/uploads/viewdetailpage.png)
![Member Detail Page](server/uploads/memberdetailpage.png)
```

Preview:

![Landing Page](server/uploads/landingpage.png)

![Team Detail Page](server/uploads/teamdeatilpage.png)

![Add Member Page](server/uploads/addm.png)

![View Detail Page](server/uploads/temdee.png)

![Member Detail Page](server/uploads/memberdetailpage.png)

![API JSON DATA](server/uploads/jsondata.jpg)


## Complete Running Order

Follow this order when starting the full project:

1. Start MongoDB.
2. Start backend with `cd server` and `node server.js`.
3. Start frontend with `cd client` and `npm run dev`.
4. Open `http://localhost:5173`.
5. Test backend health at `http://localhost:5000/api/health`.
6. Use the app and check that data is saved in MongoDB.

## Common Problems

### Backend says MongoDB connection error

Check:

- MongoDB is running.
- `MONGO_URI` is correct.
- Local MongoDB port is `27017`.

### Frontend cannot call backend

Check:

- Backend is running on `http://localhost:5000`.
- `client/.env` has `VITE_API_URL=http://localhost:5000/api`.
- `server/.env` has `CLIENT_URL=http://localhost:5173`.

### Images are not showing

Check:

- Image exists inside `server/uploads/`.
- Backend is running.
- Image URL follows `http://localhost:5000/uploads/<filename>`.

### Port already in use

Change the port in `server/.env`:

```env
PORT=5001
```

Then also update frontend API URL:

```env
VITE_API_URL=http://localhost:5001/api
```

## Git Commands

After making changes, track and commit files:

```powershell
git status
git add .
git commit -m "first commit"
```

What happens:

- `git status` shows changed and untracked files.
- `git add .` stages files for commit.
- `git commit` saves the staged files in Git history.

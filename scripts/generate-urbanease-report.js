const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "reports");
fs.mkdirSync(outDir, { recursive: true });

const imageFiles = [
  ["Landing Page", "landingpage.png"],
  ["Team Detail Page", "teamdeatilpage.png"],
  ["Add Member Page", "addmember.png"],
  ["View Members Page", "temdee.png"],
  ["Member Detail Page", "memberdetailpage.png"],
  ["API JSON Data Output", "jsondata.jpg"],
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function p(text) {
  return `<p>${esc(text)}</p>`;
}

function ul(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function table(headers, rows) {
  return `
    <table>
      <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows
          .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>`;
}

function imageTag(title, filename) {
  const filePath = path.join(root, "server", "uploads", filename);
  if (!fs.existsSync(filePath)) return "";
  const ext = path.extname(filename).toLowerCase();
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  const data = fs.readFileSync(filePath).toString("base64");
  return `
    <figure>
      <img src="data:${mime};base64,${data}" alt="${esc(title)}" />
      <figcaption>${esc(title)}</figcaption>
    </figure>`;
}

const architectureRows = [
  ["1", "User opens UrbanEase frontend in browser", "React + Vite application loads routes, pages, auth context, and responsive navigation."],
  ["2", "Frontend sends API request", "Fetch/Axios calls are sent to the backend using VITE_API_URL, normally http://localhost:5000/api."],
  ["3", "Express backend processes request", "Routes validate data, apply JWT middleware where required, and call the correct model logic."],
  ["4", "MongoDB stores and retrieves data", "Mongoose models manage users, admins, service providers, bookings, contact queries, and team members."],
  ["5", "External services are used when needed", "Razorpay handles online payments, email transport sends OTP/contact mail, and Multer stores uploaded documents."],
  ["6", "Response returns to frontend", "React pages update dashboard views, booking state, profile details, member data, and confirmation screens."],
];

const schemaRows = [
  ["User", "name, email, password, phone, address, role, isActive, isEmailVerified, otp, otpExpiresAt, isBanned, banReason", "Represents customers who register, verify email, book services, pay, and review completed bookings."],
  ["ServiceProvider", "name, email, password, phone, serviceCategory, serviceDescription, address, city, experience, rating, totalReviews, verificationStatus, isVerified", "Represents professionals who offer services and must be verified by admin before receiving bookings."],
  ["Admin", "name, email, password, role, isActive, lastLogin", "Represents privileged users who monitor users, providers, queries, and verification workflows."],
  ["Booking", "user, provider, serviceCategory, subcategory, date, timeSlot, hours, address, amount, status, paymentStatus, paymentMethod, reviewRating", "Connects a customer to a provider and records service schedule, payment information, and review data."],
  ["ContactQuery", "name, email, query, status", "Stores messages submitted from the contact page and allows admin review."],
  ["Member", "name, rollNumber, year, degree, aboutProject, hobbies, certificate, internship, aim, document", "Stores Team 13 member profile information and uploaded image/document metadata."],
];

const statusRows = [
  ["Authentication and OTP Verification", "Completed", "User and service provider signup sends OTP, verifies email, hashes passwords, and issues JWT after verification."],
  ["Role Based Routing", "Completed", "ProtectedRoute in React restricts user, admin, and provider pages based on authenticated role."],
  ["Customer Service Browsing", "Completed", "Services and provider listing pages allow users to browse providers by category, search, city, rating, and sort options."],
  ["Booking Management", "Completed", "Users create bookings; providers view assigned bookings and update status from pending to confirmed/completed/cancelled."],
  ["Payment Module", "Completed", "Razorpay order creation and signature verification are implemented, with cash-on-service support."],
  ["Admin Dashboard and Controls", "Completed", "Admin can view analytics, approve/reject providers, manage users, and review contact queries."],
  ["Provider Dashboard", "Completed", "Verified providers can manage booking status and access provider profile/account pages."],
  ["Profile Management", "Completed", "Users and providers can update profile fields through authenticated API calls."],
  ["Contact Query Module", "Completed", "Contact form stores queries in MongoDB and attempts confirmation/notification email delivery."],
  ["Team Detail Module", "Completed", "Team member add/view/detail pages store member data and uploaded files through Multer."],
  ["Realtime Notifications", "Implemented", "Backend emits realtime events for registrations, booking updates, verification changes, and deletion actions."],
  ["Deployment Readiness", "Completed", "Frontend is configured for Netlify/Vercel-style hosting, and backend supports production CORS origins."],
  ["Testing", "Manual Review Done", "Manual functional checks are documented; no automated test suite is currently included in package scripts."],
];

const references = [
  "React documentation: https://react.dev/",
  "Vite documentation: https://vite.dev/",
  "React Router documentation: https://reactrouter.com/",
  "Node.js documentation: https://nodejs.org/",
  "Express documentation: https://expressjs.com/",
  "MongoDB documentation: https://www.mongodb.com/docs/",
  "Mongoose documentation: https://mongoosejs.com/docs/",
  "JWT documentation: https://jwt.io/",
  "Razorpay documentation: https://razorpay.com/docs/",
  "Netlify documentation: https://docs.netlify.com/",
  "GitHub documentation: https://docs.github.com/",
];

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>UrbanEase Project Report</title>
  <style>
    @page { size: A4; margin: 0.85in; }
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11.5pt;
      color: #222;
      line-height: 1.42;
    }
    h1, h2, h3 {
      color: #17365d;
      page-break-after: avoid;
    }
    h1 {
      text-align: center;
      font-size: 26pt;
      margin: 0 0 12pt;
    }
    h2 {
      border-bottom: 1px solid #9eb6d8;
      font-size: 17pt;
      margin-top: 22pt;
      padding-bottom: 4pt;
    }
    h3 {
      font-size: 13.5pt;
      margin-top: 14pt;
    }
    p {
      text-align: justify;
      margin: 7pt 0;
    }
    ul {
      margin-top: 5pt;
      margin-bottom: 8pt;
    }
    li {
      margin: 3pt 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 10pt 0 14pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #7f9db9;
      padding: 6pt;
      vertical-align: top;
    }
    th {
      background: #d9eaf7;
      color: #17365d;
      font-weight: bold;
    }
    .cover {
      text-align: center;
      margin-top: 100pt;
      page-break-after: always;
    }
    .cover p {
      text-align: center;
      font-size: 13pt;
    }
    .toc {
      page-break-after: always;
    }
    .toc table td:first-child {
      width: 12%;
      text-align: center;
      font-weight: bold;
    }
    .diagram {
      border: 1px solid #7f9db9;
      background: #f5f9fc;
      padding: 10pt;
      margin: 10pt 0;
      font-family: Consolas, monospace;
      white-space: pre-wrap;
      text-align: center;
    }
    .code {
      font-family: Consolas, monospace;
      background: #f4f4f4;
      border: 1px solid #c8c8c8;
      padding: 8pt;
      white-space: pre-wrap;
      font-size: 9.5pt;
    }
    figure {
      margin: 12pt 0 18pt;
      page-break-inside: avoid;
      text-align: center;
    }
    img {
      max-width: 6.5in;
      max-height: 4.7in;
      border: 1px solid #b7b7b7;
    }
    figcaption {
      font-size: 10pt;
      color: #555;
      margin-top: 5pt;
      font-weight: bold;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <section class="cover">
    <h1>UrbanEase Project Report</h1>
    <p><strong>Full Stack Service Booking Web Application</strong></p>
    <p>Technology: MERN Stack</p>
    <p>Frontend: React + Vite | Backend: Node.js + Express | Database: MongoDB</p>
    <p>Repository: https://github.com/shahvansh877/URBANEASE_TEAM13.git</p>
  </section>

  <section>
    <h2>1. Abstract</h2>
    ${p("UrbanEase is a full-stack web application designed to simplify the process of finding and booking trusted home service providers. The application connects customers with providers from categories such as plumbing, electrical work, cleaning, carpentry, painting, appliance repair, pest control, gardening, security, and other local services. The project is built using the MERN stack, with React handling the frontend, Node.js and Express handling the backend, and MongoDB storing application data.")}
    ${p("The system supports multiple user roles: customers, service providers, and administrators. Customers can register, verify their email using OTP, browse services, choose verified providers, create bookings, complete payments, and submit reviews. Service providers can register, verify their email, wait for admin approval, and manage bookings after approval. Administrators can monitor platform activity, approve or reject providers, manage users, and view contact queries.")}
    ${p("UrbanEase also includes a Team Detail module for maintaining project team information. This module allows team member details to be uploaded, stored, viewed, and opened as individual profile pages. Uploaded files are handled by Multer and stored in the backend uploads directory. The project therefore demonstrates practical implementation of authentication, authorization, database schema design, API development, frontend routing, file upload, email integration, payment integration, and deployment preparation.")}
  </section>

  <section class="toc">
    <h2>2. Table of Contents</h2>
    ${table(["Section", "Topic"], [
      ["1", "Abstract"],
      ["2", "Table of Contents"],
      ["3", "Introduction: Problem Statement, Objectives, Scope"],
      ["4", "Technology Stack: Frontend, Backend, Database, Tools"],
      ["5", "System Design: MERN Architecture and Database Schema"],
      ["6", "Module Description"],
      ["8", "Implementation Details: Features, Code Structure, Key Logic"],
      ["9", "Deployment Details: GitHub and Netlify/Vercel Links"],
      ["10", "Project Implementation Status Table"],
      ["11", "References"],
      ["12", "Appendix: Screenshots"],
    ])}
  </section>

  <section>
    <h2>3. Introduction</h2>
    <h3>Problem Statement</h3>
    ${p("Urban households often require regular services such as cleaning, repairs, maintenance, appliance support, and small home improvement tasks. In a traditional process, users depend on local contacts, phone calls, informal recommendations, or unverified service workers. This makes the experience inconsistent because users may not know the provider's availability, reliability, service category, reviews, or booking status. Service providers also face difficulty reaching customers through a centralized platform, and administrators need a structured way to verify providers before they can offer services.")}
    ${p("The problem addressed by UrbanEase is the absence of a single organized platform where customers can browse service categories, select verified providers, book a suitable time, pay securely, and track service status. The project also solves the administrative problem of provider approval, customer management, contact query tracking, and platform monitoring.")}
    <h3>Objectives of the Project</h3>
    ${ul([
      "To develop a responsive service booking web application using React, Node.js, Express, and MongoDB.",
      "To implement secure authentication with password hashing, JWT tokens, and email OTP verification.",
      "To support role-based access for customers, service providers, and administrators.",
      "To allow customers to browse verified providers and create service bookings.",
      "To integrate payment support using Razorpay along with cash-on-service selection.",
      "To provide admin workflows for user management, provider approval/rejection, analytics, and contact query viewing.",
      "To provide provider workflows for viewing bookings and updating service status.",
      "To implement a team member management feature with form submission, database storage, and image/document upload.",
      "To prepare the application for deployment using GitHub, Netlify, Vercel, and environment-based API configuration.",
    ])}
    <h3>Scope of the Application</h3>
    ${p("The scope of UrbanEase covers an end-to-end service booking flow. The frontend includes pages for home, login, signup, services, provider listing, booking, payment, profile, dashboards, contact, and team details. The backend exposes REST APIs for authentication, services, bookings, payment, contact queries, realtime events, and member management. MongoDB collections store the persistent records required for users, service providers, admins, bookings, contacts, and members.")}
    ${p("The current version focuses on web-based access, structured service discovery, verified provider onboarding, booking management, and project demonstration. Future scope can include advanced search, location-based provider matching, automated invoices, push notifications, provider document verification, customer-provider chat, automated tests, and a dedicated mobile application.")}
  </section>

  <section>
    <h2>4. Technology Stack</h2>
    <h3>Frontend: React</h3>
    ${p("The frontend is built with React and Vite. React provides component-based UI development, while Vite provides fast development server startup and optimized production builds. React Router DOM is used for page navigation and protected routes. The project also uses Tailwind CSS-style utility classes, custom CSS, Lucide React icons, Fetch API, and Axios for communication with the backend. The AuthContext stores login state, JWT token, user role, and helper methods for signup, login, OTP verification, logout, and profile updates.")}
    <h3>Backend: Node.js and Express</h3>
    ${p("The backend is built using Node.js and Express. Express routes are organized by feature: authentication, services, bookings, payment, contact, members, and realtime updates. Middleware validates JWT tokens and restricts routes according to user role. The backend also configures CORS for local development and deployed frontend domains. Uploaded files are served from the backend uploads directory through a static Express route.")}
    <h3>Database: MongoDB</h3>
    ${p("MongoDB is used as the database and Mongoose is used as the object data modeling library. The project defines separate schemas for User, ServiceProvider, Admin, Booking, ContactQuery, and Member. Mongoose handles validation, references between collections, timestamps, password hashing hooks, and query operations. The Booking model references both User and ServiceProvider, making it the central transactional collection of the service booking flow.")}
    <h3>Tools Used</h3>
    ${table(["Tool", "Use in Project"], [
      ["Git and GitHub", "Version control and remote repository hosting."],
      ["Netlify", "Frontend deployment target indicated by production CORS origin https://urbannease.netlify.app."],
      ["Vercel", "Alternative frontend deployment target supported by CORS origins."],
      ["MongoDB Atlas or Local MongoDB", "Cloud or local database hosting."],
      ["Razorpay", "Online payment order creation and signature verification."],
      ["Multer", "File upload handling for Team Detail member documents/images."],
      ["Email Transport / Brevo / SMTP", "OTP email and contact confirmation email delivery."],
      ["VS Code", "Development environment."],
      ["npm", "Package installation and project script execution."],
    ])}
  </section>

  <section>
    <h2>5. System Design</h2>
    <h3>Architecture Diagram: MERN Stack Architecture</h3>
    <div class="diagram">Browser / User Interface
        |
        v
React + Vite Frontend
Routes, Pages, AuthContext, Forms, Dashboards
        |
        | HTTP / JSON / Multipart Form Data
        v
Node.js + Express Backend
Auth Routes | Booking Routes | Payment Routes | Contact Routes | Member Routes
        |
        | Mongoose Queries
        v
MongoDB Database
Users | ServiceProviders | Admins | Bookings | ContactQueries | Members
        |
        +-- Razorpay for payment orders and verification
        +-- Email service for OTP and contact notifications
        +-- Multer uploads stored in server/uploads</div>
    ${table(["Step", "Architecture Flow", "Description"], architectureRows)}
    <h3>ER Diagram / Database Schema</h3>
    <div class="diagram">User (1) -------- (M) Booking (M) -------- (1) ServiceProvider
  |                         |
  |                         +-- payment status, booking status, review
  |
Admin manages users, providers, and contact queries

ContactQuery is submitted by visitor/user and reviewed by admin
Member stores project team profile data and uploaded document metadata</div>
    ${table(["Collection", "Important Fields", "Purpose"], schemaRows)}
    ${p("The database design separates accounts by role. Users and service providers have OTP verification fields and encrypted passwords. Admins are stored separately because admin registration uses a secret key and has platform-level privileges. Bookings reference both a user and a service provider, allowing the application to populate booking details on customer, provider, and admin pages. Contact queries and team members are independent collections used for platform communication and project documentation.")}
  </section>

  <section>
    <h2>6. Module Description</h2>
    <h3>Authentication Module</h3>
    ${p("The authentication module is responsible for signup, OTP verification, login, token generation, and account session persistence. Customers and service providers must verify email through a six-digit OTP before they can log in. Passwords are hashed using bcryptjs before being stored in MongoDB. JWT tokens are generated with the account id and role, then stored by the frontend in localStorage under the UrbanEase token key.")}
    <h3>Dashboard Module</h3>
    ${p("The project contains separate dashboard experiences for administrators and service providers. AdminDashboard focuses on platform monitoring, provider verification, user control, and contact queries. ProviderDashboard focuses on assigned bookings and service status changes. User dashboard behavior redirects customers toward the services page so they can continue the main booking journey quickly.")}
    <h3>Service and Provider Management Module</h3>
    ${p("The Services and Providers pages allow users to browse categories and view approved service providers. The backend filters providers by category, active status, verification status, rating, city, and search text. Only providers approved by admin and marked active are returned to the public service listing API, which helps maintain user trust.")}
    <h3>Booking Module</h3>
    ${p("The booking module lets authenticated customers choose a provider, service category, date, time slot, address, instructions, number of hours, and amount. The backend validates required fields, confirms that the provider is available and verified, creates a booking record, and emits realtime booking events. Providers can update booking status through controlled transitions, such as pending to confirmed and confirmed to completed.")}
    <h3>Payment Module</h3>
    ${p("The payment module integrates Razorpay. The backend creates an order for the selected booking amount in paise, stores the Razorpay order id, and returns payment details to the frontend. After payment, the backend verifies the Razorpay signature using HMAC SHA-256 and updates the booking with payment id, signature, payment method, paid time, and paid status. The system also supports cash-on-service where payment remains pending until service delivery.")}
    <h3>Admin Module</h3>
    ${p("The admin module includes provider approval/rejection, provider analytics, user analytics, user ban/unban, user deletion, provider deletion, and contact query listing. Admin routes are protected by JWT and an isAdmin middleware. Provider approval also emits realtime events to update both admin and provider views.")}
    <h3>Contact Query Module</h3>
    ${p("The contact module stores visitor queries with name, email, message, and status. It validates required fields and email format before saving. After saving, it attempts to send a confirmation email to the user and a notification email to the platform. Admins can view submitted queries using the protected admin contact API.")}
    <h3>Team Detail Module</h3>
    ${p("The Team Detail feature manages Team 13 project member data. Users can open the team page, add a member, view all members, and open a member details page. The add member form accepts profile details such as name, roll number, year, degree, project description, hobbies, certificates, internship, aim, and document/image upload. Multer stores uploaded files in server/uploads and MongoDB stores the file metadata.")}
    <h3>Mobile Navigation and Responsive UI Module</h3>
    ${p("The application includes a MobileBottomNav component and responsive profile pages. App.jsx detects mobile viewport width and renders mobile account pages for user, provider, and admin profiles. This improves usability on smaller screens and keeps navigation accessible for mobile users.")}
  </section>

  <section>
    <h2>8. Implementation Details</h2>
    <h3>Overview of Features Developed</h3>
    ${ul([
      "Home page and public navigation for UrbanEase branding and service discovery.",
      "Signup and login flows for users, service providers, and admins.",
      "Email OTP verification for normal users and service providers.",
      "JWT-based protected routes and role checks on frontend and backend.",
      "Service category listing and verified provider browsing.",
      "Booking creation with date, time, address, amount, and provider relation.",
      "Provider booking dashboard with status updates and booking list.",
      "Razorpay online payment and cash-on-service option.",
      "Review submission for completed bookings and automatic provider rating summary update.",
      "Admin provider verification, user management, provider management, and analytics APIs.",
      "Contact form with database storage and email notification attempt.",
      "Team Detail module with member add, list, details, and upload support.",
      "Realtime event utility for booking, registration, verification, and deletion updates.",
      "Deployment-oriented CORS configuration and environment-based API URL setup.",
    ])}
    <h3>Code Structure: Folder Breakdown</h3>
    ${table(["Path", "Description"], [
      ["client/src/App.jsx", "Defines frontend routes, protected routes, responsive profile routing, scroll handling, and MobileBottomNav rendering."],
      ["client/src/context/AuthContext.jsx", "Stores authentication state and provides signup, OTP verification, login, logout, and profile update helpers."],
      ["client/src/pages", "Contains user-facing pages such as HomePage, ServicesPage, BookingPage, PaymentPage, dashboards, profiles, team pages, and contact pages."],
      ["client/src/components", "Reusable UI components such as MobileBottomNav, TeamNavbar, and SiteFooter."],
      ["client/src/config/api.js", "Central API base URL helper using VITE_API_URL with localhost fallback."],
      ["server/server.js", "Main Express server configuration, CORS setup, route registration, static uploads, health check, and error handler."],
      ["server/routes", "Feature-based Express route files for auth, services, bookings, payment, contact, and members."],
      ["server/models", "Mongoose schemas for User, ServiceProvider, Admin, Booking, ContactQuery, and Member."],
      ["server/middleware/Auth.js", "JWT protection middleware and role-based guards."],
      ["server/config", "Database connection, mailer, contact mailer, and email transport configuration."],
      ["server/uploads", "Storage location for uploaded member documents/images and project screenshots."],
      ["server/utils/realtime.js", "Realtime event routing and event emission helpers."],
    ])}
    <h3>Key Snippets or Logic</h3>
    <p><strong>Protected Frontend Route Logic</strong></p>
    <div class="code">function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return &lt;LoadingScreen /&gt;;
  if (!isAuthenticated) return &lt;Navigate to="/login" replace /&gt;;
  if (allowedRoles &amp;&amp; !allowedRoles.includes(user?.role)) {
    return &lt;Navigate to="/" replace /&gt;;
  }
  return children;
}</div>
    <p><strong>JWT Backend Protection Logic</strong></p>
    <div class="code">const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await findUserByRole(decoded.id, decoded.role);
req.user = user;
req.userRole = decoded.role;</div>
    <p><strong>Booking Creation Logic</strong></p>
    <div class="code">const booking = await Booking.create({
  user: req.user._id,
  provider: provider._id,
  serviceCategory,
  date,
  timeSlot,
  hours: Number(hours) || 1,
  address,
  amount: Number(amount),
});</div>
    <p><strong>Payment Verification Logic</strong></p>
    <div class="code">const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest("hex");</div>
    ${p("These snippets show the main security and workflow patterns used in UrbanEase. Frontend routes prevent unauthorized pages from rendering. Backend middleware validates JWT tokens before accessing protected APIs. Booking creation links the authenticated user with a verified provider. Razorpay verification confirms that the payment response is authentic before marking a booking as paid.")}
  </section>

  <section>
    <h2>9. Deployment Details</h2>
    ${p("UrbanEase is organized for separate frontend and backend deployment. The frontend is inside the client folder and can be deployed to Netlify or Vercel after running a production build. The backend is inside the server folder and can be deployed to a Node.js hosting service such as Render, Railway, or a VPS. MongoDB can run locally during development or use MongoDB Atlas in production.")}
    ${table(["Deployment Item", "Details"], [
      ["GitHub Repository", "https://github.com/shahvansh877/URBANEASE_TEAM13.git"],
      ["Frontend Deployment Link", "https://urbannease.netlify.app"],
      ["Alternative Frontend Links Supported by CORS", "https://urbannease.vercel.app and https://urbanease.vercel.app"],
      ["Frontend Build Command", "cd client then npm run build"],
      ["Frontend Output Folder", "client/dist"],
      ["Backend Start Command", "cd server then npm start or node server.js"],
      ["Backend Local URL", "http://localhost:5000"],
      ["Frontend Local URL", "http://localhost:5173"],
      ["API Health Check", "http://localhost:5000/api/health"],
      ["Environment Variables", "VITE_API_URL, PORT, MONGO_URI, JWT_SECRET, ADMIN_SECRET_KEY, CLIENT_URL, email settings, Razorpay keys"],
    ])}
    ${p("For deployment, the frontend environment variable VITE_API_URL must point to the deployed backend API URL ending with /api. The backend must contain production values for MONGO_URI, JWT_SECRET, CLIENT_URL, email configuration, and Razorpay keys. The backend CORS configuration already allows the Netlify and Vercel frontend origins listed above.")}
  </section>

  <section>
    <h2>10. Project Implementation Status Table</h2>
    ${p("The following final review table summarizes the implementation status of the main UrbanEase modules. It can be reused directly in the project presentation as the final review table.")}
    ${table(["Feature / Module", "Status", "Final Review Remarks"], statusRows)}
  </section>

  <section>
    <h2>11. References</h2>
    ${ul(references.map(esc))}
  </section>

  <section class="page-break">
    <h2>12. Appendix: Screenshots</h2>
    ${p("The following screenshots are taken from the existing project assets stored in server/uploads. They show the implemented UrbanEase user interface, Team Detail pages, member detail output, and API data output.")}
    ${imageFiles.map(([title, filename]) => imageTag(title, filename)).join("\n")}
  </section>
</body>
</html>`;

const docPath = path.join(outDir, "UrbanEase_Project_Report.doc");
const htmlPath = path.join(outDir, "UrbanEase_Project_Report.html");

fs.writeFileSync(docPath, html, "utf8");
fs.writeFileSync(htmlPath, html, "utf8");

console.log(`Created ${docPath}`);
console.log(`Created ${htmlPath}`);

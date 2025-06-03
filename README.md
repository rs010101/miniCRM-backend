# 🚀 MiniCRM Backend

A powerful, scalable backend service for the MiniCRM application, built with Node.js, Express, and MongoDB.

## 📋 Features

- 🔐 **Authentication & Authorization**
  - Google OAuth integration
  - JWT-based authentication
  - Role-based access control

- 👥 **Customer Management**
  - CRUD operations for customer data
  - Bulk import functionality
  - Advanced customer segmentation

- 📊 **Campaign Management**
  - Create and manage marketing campaigns
  - AI-powered message generation
  - Real-time campaign statistics
  - Automated message delivery

- 📈 **Order Management**
  - Order tracking and history
  - Order analytics and reporting
  - Customer order relationships

- 🎯 **Segmentation Rules**
  - Dynamic customer segmentation
  - Rule-based targeting
  - Real-time segment updates

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT & Google OAuth
- **API Documentation**: Swagger/OpenAPI
- **AI Integration**: Google's Gemini API

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- Google OAuth credentials

### Environment Setup 🛠️

1. Create a `.env` file in the root directory:
\`\`\`env
# Database Configuration
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret

# API Keys
GEMINI_API=your_gemini_api_key

# Application Settings
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
\`\`\`

### Installation Steps 📥

1. **Clone the Repository**
   ```powershell
   git clone https://github.com/rs010101/miniCRM-backend
   Set-Location miniCRM/backend
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Start the Application**
   - For production:
     ```powershell
     npm start
     ```
   - For development (with hot-reload):
     ```powershell
     npm run dev
     ```

## 📁 Project Structure

```plaintext
backend/
├── src/
│   ├── apis/
│   │   ├── controllers/     # Request handlers and business logic
│   │   │   ├── campaignController.js
│   │   │   ├── customerController.js
│   │   │   ├── orderController.js
│   │   │   └── ...
│   │   ├── routes/         # API route definitions and documentation
│   │   │   ├── campaignRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   └── ...
│   │   └── services/       # Business logic and external services
│   │       ├── campaignService.js
│   │       ├── messageQueueService.js
│   │       └── ...
│   ├── middlewares/        # Custom middleware (auth, validation)
│   │   └── auth.js
│   ├── models/            # Database models and schemas
│   │   ├── Campaign.js
│   │   ├── Customer.js
│   │   └── ...
│   └── utils/             # Utility functions and helpers
│       ├── messageUtils.js
│       └── redisClient.js
├── server.js              # Application entry point
└── package.json          # Project dependencies and scripts
```

## 🔗 API Documentation

API documentation is available at `/api-docs` when the server is running. Built with Swagger/OpenAPI for easy exploration and testing of endpoints.

### Main API Endpoints

- **Authentication**: `/api/auth/google`
- **Users**: `/api/user`
- **Customers**: `/api/customers`
- **Orders**: `/api/orders`
- **Campaigns**: `/api/campaigns`
- **Segment Rules**: `/api/segment-rules`
- **Communication Logs**: `/api/communication-logs`

## 🔒 Security Features

- CORS protection
- JWT authentication
- Request rate limiting
- Input validation
- Error handling middleware
- Secure password hashing
- MongoDB injection protection

## ⚡ Performance Features

- Redis caching
- Database connection pooling
- Request compression
- Efficient query optimization
- Background job processing
- Graceful error handling

## 🧪 Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run tests with coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

## 📚 Error Handling

The application uses a centralized error handling mechanism with custom error classes and middleware for consistent error responses.

## 🔄 CI/CD

Continuous Integration and Deployment is set up with:
- Automated testing
- Code quality checks
- Automatic deployment to production

## 📦 Dependencies

Key dependencies include:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `redis`: Caching
- `swagger-jsdoc`: API documentation
- `google-auth-library`: Google OAuth

## 👥 Author

Radhika Singhal

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Redis Cloud for caching services
- Render for application hosting

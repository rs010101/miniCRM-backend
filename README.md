# 🚀 MiniCRM Backend

A powerful, scalable backend service for the MiniCRM application, built with Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

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
- **API Documentation**: Swagger
- **AI Integration**: Google's Gemini API

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- Google OAuth credentials

### Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`env
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API=your_gemini_api_key
REDIS_URL=your_redis_url
BACKEND_URL=your_backend_url
FRONTEND_URL=your_frontend_url
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd miniCRM/backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the server:
\`\`\`bash
npm start
\`\`\`

For development:
\`\`\`bash
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── apis/
│   ├── controllers/    # Request handlers
│   ├── routes/         # API route definitions
│   └── services/       # Business logic
├── middlewares/        # Custom middleware
├── models/            # Database models
└── utils/             # Utility functions
\`\`\`

## 🔗 API Documentation

API documentation is available at `/api-docs` when the server is running. Built with Swagger for easy exploration and testing of endpoints.

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 👥 Author

Radhika Singhal

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Redis Cloud for caching services
- Render for application hosting

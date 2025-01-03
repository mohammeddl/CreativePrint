# PrintForge - Print On Demand Platform

PrintForge is a comprehensive print-on-demand platform enabling creators to design, customize, and sell custom products with automated production and delivery.

## Features

- Design Editor: Intuitive interface for product customization
- Multi-role System: Admin, Client, and Partner access levels
- Product Management: Extensive catalog with real-time previews
- Order Processing: Automated handling and tracking
- Analytics Dashboard: Sales tracking and performance metrics
- Affiliate System: Built-in marketing and referral tools
- Multi-currency & Multi-language Support

## Tech Stack

**Frontend:**
- React.js with Next.js
- TypeScript
- TailwindCSS

**Backend:**
- Spring Boot
- PostgreSQL
- REST APIs

**Infrastructure:**
- Docker
- Jenkins CI/CD
- DigitalOcean

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Docker
- PostgreSQL 14+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/printforge.git
```

2. Backend setup:
```bash
cd printforge-backend
./mvnw clean install
./mvnw spring-boot:run
```

3. Frontend setup:
```bash
cd printforge-frontend
npm install
npm run dev
```

4. Database setup:
```bash
docker-compose up -d database
```

## Environment Variables

Create `.env` files in both frontend and backend directories:

```env
# Backend
DB_URL=jdbc:postgresql://localhost:5432/printforge
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

For support, email support@printforge.com or open an issue in the repository.
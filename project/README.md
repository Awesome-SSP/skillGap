# Skill Gap Finder - Full-Stack Application

A comprehensive web application that analyzes PDF resumes, identifies skill gaps for target job roles, and provides personalized learning recommendations using AI-powered NLP processing.

## 🚀 Features

- **Real PDF Resume Parsing**: Upload actual PDF resumes (no mock data)
- **AI-Powered Skill Extraction**: Uses spaCy NLP for intelligent skill identification
- **Job Role Comparison**: Compare your skills against 8+ predefined job roles
- **Personalized Recommendations**: Curated learning resources for missing skills
- **Progress Tracking**: Dashboard to monitor learning progress
- **Modern UI/UX**: Apple-level design with smooth animations and responsive layout

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Axios** for API integration
- **Vite** for fast development and building

### Backend
- **FastAPI** with Python 3.13.5 for high-performance API
- **pdfplumber** for robust PDF text extraction
- **spaCy** for NLP processing and skill extraction
- **JSON file storage** for data persistence
- **CORS enabled** for frontend-backend communication

## 📦 Project Structure

```
skill-gap-finder/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API integration
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── README.md
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── services/        # Business logic
│   │   ├── storage/         # Data persistence
│   │   ├── models/          # Pydantic models
│   │   └── data/            # JSON data files
│   ├── requirements.txt
│   └── README.md
└── README.md                # This file
```

## 🛠️ Setup and Installation

### Prerequisites
- **Python 3.13.5** (use pyenv or similar for version management)
- **Node.js 16+** (use nvm or similar for version management)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Download spaCy language model:**
```bash
python -m spacy download en_core_web_sm
```

5. **Start the backend server:**
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🎯 How to Use

### 1. Upload Resume
- Visit `http://localhost:5173`
- Click "Get Started" or navigate to Upload page
- Drag and drop your PDF resume (max 5MB)
- Select your target job role from the dropdown

### 2. Analyze Skills
- The system will parse your resume using AI
- Extract your name, contact info, skills, and experience
- Compare your skills against job requirements
- View detailed skill gap analysis with percentage match

### 3. Get Recommendations
- Receive personalized learning resources for missing skills
- Filter recommendations by difficulty and resource type
- Save learning plans to your dashboard
- Track progress over time

### 4. Dashboard
- View all your saved learning plans
- Monitor progress and achievements
- Access learning resources quickly
- Analyze historical skill development

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload_resume` | Upload and parse PDF resume |
| POST | `/api/analyze_skills` | Analyze skill gaps |
| GET | `/api/roles` | Get available job roles |
| POST | `/api/recommendations` | Get learning recommendations |
| POST | `/api/save_plan` | Save learning plan |
| GET | `/api/user/{user_id}` | Get user data |

## 📊 Supported Job Roles

- Data Analyst
- Python Developer
- Frontend Developer
- Machine Learning Engineer
- Full Stack Developer
- DevOps Engineer
- Data Scientist
- Mobile Developer

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Trust, professionalism
- **Secondary**: Purple (#8B5CF6) - Innovation, creativity  
- **Accent**: Green (#10B981) - Success, growth
- **Supporting**: Gray scales for text and backgrounds

### Typography
- Apple system fonts for optimal readability
- Clear hierarchy with proper line heights
- Responsive text scaling

### Components
- Card-based layout for information grouping
- Smooth animations and micro-interactions
- Loading states and error handling
- Mobile-first responsive design

## 🧪 Development

### Code Quality
```bash
# Backend linting and formatting
cd backend
pip install black isort flake8
black .
isort .
flake8 .

# Frontend linting
cd frontend
npm run lint
```

### Testing
```bash
# Backend tests
cd backend
pip install pytest pytest-asyncio httpx
pytest

# Frontend tests  
cd frontend
npm install --save-dev @testing-library/react vitest
npm run test
```

## 📈 Performance

### Backend Optimizations
- File locking for concurrent JSON operations
- Efficient PDF parsing with pdfplumber
- Optimized spaCy model loading
- Request/response compression

### Frontend Optimizations
- Code splitting with dynamic imports
- Image optimization and lazy loading
- Efficient re-renders with React hooks
- Bundle size optimization with Vite

## 🔒 Security

### Current Implementation
- File type and size validation
- Text sanitization for outputs
- CORS configuration for API access
- Input validation with Pydantic models

### Production Recommendations
- Rate limiting implementation
- Authentication and authorization
- HTTPS enforcement
- Input sanitization and validation
- Security headers

## 🚀 Deployment

### Backend Deployment
```bash
# Use production WSGI server
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Netlify, Vercel, or similar
# Set build command: npm run build
# Set publish directory: dist
```

### Environment Variables
```bash
# Backend
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 🔮 Future Enhancements

### Planned Features
- User authentication and accounts
- Multiple resume comparison
- Industry-specific skill requirements
- Skill certification tracking
- AI-powered career path recommendations
- Integration with job boards
- Social features and skill sharing

### Technical Improvements
- Database migration (PostgreSQL/MongoDB)
- Caching layer (Redis)
- Search functionality (Elasticsearch)
- Real-time notifications
- Advanced analytics and reporting
- API rate limiting and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code patterns and style
- Add TypeScript types for all new code
- Include proper error handling
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **spaCy** for powerful NLP capabilities
- **FastAPI** for excellent API framework
- **React** and **Tailwind** for modern frontend development
- **pdfplumber** for reliable PDF processing
- The open-source community for inspiration and tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the individual README files in `frontend/` and `backend/` directories
2. Review the API documentation at `http://localhost:8000/docs`
3. Open an issue on GitHub with detailed information
4. Include error logs and steps to reproduce

## 📊 Example Usage

```bash
# Complete setup from scratch
git clone https://github.com/your-username/skill-gap-finder.git
cd skill-gap-finder

# Setup backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000 &

# Setup frontend
cd ../frontend
npm install
npm run dev

# Visit http://localhost:5173 and start analyzing!
```

---

**Built with ❤️ for career development and skill enhancement**
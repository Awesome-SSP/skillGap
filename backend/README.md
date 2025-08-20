# Skill Gap Finder - Backend

FastAPI backend for the Skill Gap Finder application with PDF parsing, NLP-based skill extraction, and JSON-based storage.

## Requirements

- Python 3.13.5 (recommended using pyenv or similar)
- pip package manager

## Setup

1. **Create and activate virtual environment:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Download spaCy language model:**
```bash
python -m spacy download en_core_web_sm
```

## Running the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API documentation will be available at `http://localhost:8000/docs`

## Project Structure

```
backend/
├── app/
│   ├── main.py               # FastAPI application entry point
│   ├── api/
│   │   └── routes.py         # API endpoints
│   ├── services/
│   │   ├── parser.py         # PDF parsing with pdfplumber
│   │   ├── nlp.py            # spaCy-based NLP processing
│   │   ├── jobs.py           # Job roles and skills management
│   │   └── recommend.py      # Learning recommendations
│   ├── storage/
│   │   └── data_store.py     # JSON file-based storage
│   ├── models/
│   │   └── resume.py         # Pydantic data models
│   └── data/
│       ├── roles.json        # Job roles and required skills
│       ├── resources.json    # Learning resources
│       └── users.json        # User data and learning plans
├── requirements.txt
└── README.md
```

## API Endpoints

- `POST /api/upload_resume` - Upload and parse PDF resume
- `POST /api/analyze_skills` - Analyze skill gaps
- `GET /api/roles` - Get available job roles
- `POST /api/recommendations` - Get learning recommendations
- `POST /api/save_plan` - Save learning plan
- `GET /api/user/{user_id}` - Get user data

## Features

### PDF Parsing
- Uses `pdfplumber` for robust text extraction from PDF files
- Supports multi-page documents
- Validates file type and size (max 5MB)

### NLP Processing
- Uses spaCy `en_core_web_sm` model for named entity recognition
- Extracts names, contact information, and technical skills
- Fuzzy matching against curated skill keywords
- Regex patterns for email and phone number extraction

### Data Storage
- JSON file-based storage with file locking for concurrency
- Persistent user data and learning plans
- Editable job roles and learning resources

### Skill Matching
- Compares user skills against job role requirements
- Calculates skill gap percentage
- Provides detailed missing/matched skill lists

## Configuration

### Adding New Job Roles
Edit `app/data/roles.json`:
```json
{
  "New Role Name": [
    "Required Skill 1",
    "Required Skill 2",
    "..."
  ]
}
```

### Adding Learning Resources
Edit `app/data/resources.json`:
```json
{
  "Skill Name": [
    {
      "title": "Resource Title",
      "description": "Resource description",
      "url": "https://example.com",
      "duration": "10 hours",
      "difficulty": "Beginner",
      "type": "Course"
    }
  ]
}
```

## Development

### Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Quality
```bash
# Install linting tools
pip install black isort flake8

# Format code
black .
isort .

# Lint code
flake8 .
```

## Production Deployment

1. Set environment variables for production
2. Use a production WSGI server like Gunicorn
3. Configure proper logging and monitoring
4. Set up database instead of JSON files for scalability
5. Implement proper authentication and authorization
6. Add rate limiting and security headers

## Troubleshooting

### spaCy Model Issues
If you get errors about missing spaCy models:
```bash
python -m spacy download en_core_web_sm
```

### File Permission Issues
Make sure the `data/` directory is writable:
```bash
chmod 755 app/data/
```

### Import Errors
Make sure you're running from the backend directory and your virtual environment is activated.
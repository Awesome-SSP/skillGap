# Skill Gap Finder - Frontend

React + TypeScript + Tailwind CSS frontend for the Skill Gap Finder application.

## Requirements

- Node.js 16+ (recommended: use nvm or similar)
- npm or yarn package manager

## Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

### Multi-Step Workflow
- **Landing Page**: Hero section with 3-step process visualization
- **Upload Page**: Drag-and-drop PDF uploader with role selection
- **Analysis Page**: Skill gap analysis with comparison tables
- **Recommendations Page**: Curated learning resources with filtering
- **Dashboard**: Progress tracking and saved learning plans

### Modern UI/UX
- Responsive design with mobile-first approach
- Gradient color system: Primary blue, Secondary purple, Accent green
- Smooth animations and micro-interactions
- Loading states and error handling
- Apple-level design aesthetics with attention to detail

### Components
- `FileUpload`: Drag-and-drop PDF uploader with validation
- `RoleSelect`: Searchable dropdown for job roles
- `ProgressStepper`: Visual workflow progress indicator
- `LoadingSpinner`: Consistent loading states
- `Header`: Navigation with active state indicators

### State Management
- React hooks for local state management
- Global app state passed through props
- API integration with axios and error handling

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── FileUpload.tsx
│   │   ├── RoleSelect.tsx
│   │   ├── ProgressStepper.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Header.tsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── AnalysisPage.tsx
│   │   ├── RecommendationsPage.tsx
│   │   └── Dashboard.tsx
│   ├── services/          # API integration
│   │   └── api.ts
│   ├── types/             # TypeScript types
│   │   └── api.ts
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## API Integration

### Base Configuration
- Base URL: `http://localhost:8000/api`
- Request/response interceptors for logging and error handling
- Automatic error message extraction and user-friendly display

### Endpoints Used
- `POST /upload_resume` - Upload and parse PDF resume
- `POST /analyze_skills` - Analyze skill gaps
- `GET /roles` - Get available job roles  
- `POST /recommendations` - Get learning recommendations
- `POST /save_plan` - Save learning plan
- `GET /user/{user_id}` - Get user data and learning plans

### Error Handling
- Network error detection with helpful messages
- Backend error parsing and display
- Graceful fallbacks for API failures
- User-friendly error messages

## Styling

### Tailwind CSS Configuration
- Custom color system with primary, secondary, and accent colors
- Extended animations (fade-in, slide-up, bounce-light)
- Responsive breakpoints for mobile, tablet, desktop
- Custom component classes for buttons, cards, inputs

### Design System
- Consistent 8px spacing system
- Typography hierarchy with proper line heights
- Color ramps with multiple shades for each color
- Shadow system for depth and elevation
- Border radius and consistent visual language

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Organization
- TypeScript for type safety
- Consistent component structure with props interfaces
- Separation of concerns (components, services, types, pages)
- Custom hooks for reusable logic
- Proper error boundaries and loading states

### Testing
```bash
# Install testing dependencies (optional)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables if needed

### Environment Variables
Create a `.env` file for custom configuration:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Code splitting with React.lazy (if implemented)
- Image optimization and lazy loading
- Bundle size optimization with Vite
- Efficient re-renders with proper dependency arrays
- Memoization for expensive computations

## Troubleshooting

### Common Issues

**API Connection Issues:**
- Make sure backend is running on `http://localhost:8000`
- Check CORS configuration in backend
- Verify network connectivity

**File Upload Issues:**
- Check file size limits (5MB max)
- Ensure PDF file format
- Verify multipart/form-data support

**Styling Issues:**
- Run `npm run build` to rebuild Tailwind
- Check for conflicting CSS classes
- Verify Tailwind configuration

### Development Tips

1. Use browser developer tools for debugging
2. Check network tab for API request/response details
3. Use React Developer Tools extension
4. Enable strict mode for development
5. Use TypeScript compiler for type checking

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new components
3. Include proper error handling and loading states
4. Write responsive CSS with mobile-first approach
5. Test across different browsers and devices
6. Update documentation for new features

## Future Enhancements

- Unit and integration tests
- Internationalization (i18n)
- Progressive Web App (PWA) features
- Advanced analytics and tracking
- Social sharing capabilities
- Accessibility improvements (WCAG 2.1)
- Performance monitoring
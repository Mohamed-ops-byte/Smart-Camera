# Smart Camera Surveillance System - Development Guidelines

## Project Overview

This is a modern, feature-rich smart surveillance system frontend built with React and TypeScript.

## Key Features
- Real-time camera monitoring
- AI-powered face recognition
- Theft and intrusion detection
- Resident identification and management
- Smart alert system
- Event recording and playback
- Multi-language support (Arabic & English)

## Architecture

### Modular Structure
The project follows a modular architecture with clear separation of concerns:

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── store/           # State management (Zustand)
├── services/        # API services and external integrations
├── utils/           # Utility functions and formatters
├── types/           # TypeScript type definitions
├── assets/          # Images and static files
└── styles/          # Global styles
```

## Code Standards

### Component Structure
- Use functional components with hooks
- Create one component per file
- Export as default
- Use TypeScript interfaces for props
- Include JSDoc comments for complex components

### Naming Conventions
- Components: PascalCase (e.g., `CameraCard.tsx`)
- Utilities: camelCase (e.g., `formatters.ts`)
- Types: PascalCase (e.g., `Camera`)
- Constants: UPPER_SNAKE_CASE
- Files with export: matching case (e.g., `index.ts`)

### Imports
- Use path aliases defined in `tsconfig.json`
- Group imports: React → libraries → local
- Each import group separated by blank line

## Styling

- Use Tailwind CSS for styling
- Follow the color scheme defined in `tailwind.config.js`
- Use spacing scale consistently
- Implement responsive design with Tailwind breakpoints
- Direction: RTL by default (Arabic interface)

## State Management

- Use Zustand for global state
- Store location: `src/store/`
- Split stores by feature/domain
- Include loading and error states

## API Integration

- All API calls go through `ApiService` in `src/services/api.ts`
- Use Axios for HTTP requests
- Handle errors gracefully
- Include proper typing for API responses

## Development Workflow

1. **Setup**
   ```bash
   npm install
   npm run dev
   ```

2. **Create Features**
   - Create component in appropriate subdirectory
   - Export from component index file
   - Import in respective page or parent component

3. **Add Styles**
   - Use Tailwind classes inline
   - Add custom CSS to `src/styles/globals.css` if needed

4. **Test Locally**
   - Run `npm run dev`
   - Test in browser at http://localhost:3000

5. **Build**
   ```bash
   npm run build
   npm run preview
   ```

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize images
- Use debouncing for search/filter inputs

### Accessibility
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Error Handling
- Catch API errors gracefully
- Show user-friendly error messages
- Log errors for debugging
- Implement retry logic where appropriate

### Code Quality
- Keep components small and focused
- DRY principle - avoid code duplication
- Use TypeScript strictly
- Write self-documenting code
- Add comments for complex logic

## Commit Messages

Format: `[type]: [description]`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Styling changes
- `docs`: Documentation
- `chore`: Maintenance tasks

Example: `feat: add face recognition modal`

## Testing

```bash
npm run lint    # Run ESLint
npm run build   # Build for production
npm run preview # Preview production build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_DEBUG`: Enable debug logging

## Common Tasks

### Add New Page
1. Create file in `src/pages/`
2. Create component
3. Add to navigation if needed
4. Update routing if using router

### Add New Component
1. Create directory in `src/components/[Category]/`
2. Create component file and `index.ts`
3. Add TypeScript interfaces
4. Export from parent index

### Add New API Endpoint
1. Add method to `ApiService` class
2. Add type definitions to `src/types/`
3. Add actions to Zustand store
4. Use in components via store

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found
- Check path aliases in `tsconfig.json`
- Verify import statements
- Clear node_modules and reinstall

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.vercel.app/)
- [Vite Documentation](https://vitejs.dev)

## Support

For questions or issues:
1. Check existing documentation
2. Review component examples
3. Check Git history for similar features
4. Create an issue with detailed information

---

Last Updated: February 2026

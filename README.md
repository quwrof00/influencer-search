# Wobb Frontend Assignment Submission

This is a complete rebuild of the starter influencer search application, developed using React, TypeScript, Vite, Zustand, and Tailwind CSS. The project was refactored to address all intentional bugs, improve the overall architecture, and deliver a modern user experience.

## Live Demo
The application is deployed and available to test here:  
👉 **[https://quwrof00.github.io/influencer-search/](https://quwrof00.github.io/influencer-search/)**

## Running the Application

To run the app locally, install the dependencies and start the development server:

```bash
npm install
npm run dev
```

You can verify that the production build passes all checks with no warnings by running `npm run build`.

## Project Updates and Implementations

### Architecture and State Management
I removed the existing React Context setup and replaced it with Zustand to handle state management across the application. I utilized Zustand's persist middleware to save the user's selected campaign list directly to localStorage. This ensures that the user's data remains intact across page reloads without adding the overhead of a larger database solution like IndexedDB, which would be unnecessary for storing small arrays of influencer objects.

### Interface Redesign
The entire application layout was redesigned to prioritize usability and visual hierarchy. I used Tailwind CSS alongside Framer Motion to handle page transitions and micro-interactions. The "Add to List" feature, which was previously an inactive stub, is now fully functional. It operates via a sliding side panel that can be toggled from anywhere in the app, allowing users to build and review their campaign lists dynamically without losing their place on the search page.

### Resiliency and Bug Fixes
The original codebase contained several bugs, including strict mode incompatibilities and routing mismatches, which have all been fixed. I also implemented robust fallback mechanisms for the data layers:
* Image loading: Many of the avatar URLs provided in the raw JSON files are expired or protected against hotlinking. I added onError fallbacks throughout the application so that if a primary image fails to load, a clean, auto-generated placeholder is rendered in its place.
* Data loading: Since only six specific users have detailed JSON files provided in the data directory, attempting to view the profile of any other user resulted in a 404 error. To prevent this, the profileLoader utility was rewritten to scan the platform JSON arrays. If a detailed file is missing, the application dynamically constructs a fallback profile view using their search summary data.

### Code Cleanup
I audited the project structure and removed obsolete files like the unused SearchBar and SelectedProfilesList components. All files are properly typed with TypeScript, and the final codebase passes the linter with zero errors.

## Author
Shourya

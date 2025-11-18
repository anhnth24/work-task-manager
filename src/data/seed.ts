import type { User, Task, Activity } from '@/types';
import { generateId } from '@/utils/misc';
import { db } from './db';

// Mock users with different roles
const MOCK_USERS: User[] = [
  { id: generateId(), name: 'Hải Anh', role: 'Full Stack Developer', avatar: '👨‍💻' },
];

// Task templates with tech-focused titles and descriptions (commented out - not currently used)
// const TASK_TEMPLATES = [
//   // Frontend tasks
//   { title: 'Implement responsive navigation menu', desc: 'Create a mobile-first responsive navigation with hamburger menu and smooth transitions', tags: ['frontend', 'ui/ux'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Add dark mode toggle', desc: 'Implement dark mode with system preference detection and local storage persistence', tags: ['frontend', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Optimize image loading performance', desc: 'Implement lazy loading and responsive images with next-gen formats (WebP, AVIF)', tags: ['frontend', 'feature'] as Tag[], priority: 'high' as Priority },
//   { title: 'Fix CSS layout issues on Safari', desc: 'Resolve flexbox and grid layout inconsistencies specifically affecting Safari browser', tags: ['frontend', 'bug'] as Tag[], priority: 'high' as Priority },
//   { title: 'Create reusable button component library', desc: 'Design and implement accessible button variants (primary, secondary, ghost, danger) with proper ARIA labels', tags: ['frontend', 'ui/ux'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Implement infinite scroll for feed', desc: 'Add intersection observer-based infinite scrolling with loading states and error handling', tags: ['frontend', 'feature'] as Tag[], priority: 'low' as Priority },
//   { title: 'Add form validation with Zod', desc: 'Implement client-side form validation using Zod schema with real-time error messages', tags: ['frontend', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Fix memory leak in React components', desc: 'Investigate and fix memory leaks caused by uncleared intervals and subscriptions', tags: ['frontend', 'bug'] as Tag[], priority: 'high' as Priority },
//   { title: 'Implement skeleton loading states', desc: 'Add skeleton screens for better perceived performance during data fetching', tags: ['frontend', 'ui/ux'] as Tag[], priority: 'low' as Priority },
//   { title: 'Add accessibility improvements', desc: 'Enhance keyboard navigation, screen reader support, and WCAG 2.1 AA compliance', tags: ['frontend', 'ui/ux'] as Tag[], priority: 'high' as Priority },
//   
//   // Backend tasks
//   { title: 'Implement JWT authentication', desc: 'Set up JWT-based authentication with refresh tokens and secure httpOnly cookies', tags: ['backend', 'api', 'feature'] as Tag[], priority: 'high' as Priority },
//   { title: 'Optimize database queries', desc: 'Add indexes and optimize N+1 queries using dataloader pattern for better performance', tags: ['backend', 'database'] as Tag[], priority: 'high' as Priority },
//   { title: 'Create RESTful API for user management', desc: 'Implement CRUD endpoints for user management with proper error handling and validation', tags: ['backend', 'api', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Fix race condition in payment processing', desc: 'Resolve concurrent payment processing issues using database transactions and locks', tags: ['backend', 'bug'] as Tag[], priority: 'high' as Priority },
//   { title: 'Implement rate limiting middleware', desc: 'Add Redis-based rate limiting to prevent API abuse and DDoS attacks', tags: ['backend', 'api', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Add comprehensive error logging', desc: 'Integrate structured logging with Sentry/Datadog for better error tracking and debugging', tags: ['backend', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Migrate to PostgreSQL 15', desc: 'Upgrade database from PostgreSQL 13 to 15 and test migration scripts', tags: ['backend', 'database'] as Tag[], priority: 'low' as Priority },
//   { title: 'Implement GraphQL subscriptions', desc: 'Add real-time updates using GraphQL subscriptions with WebSocket support', tags: ['backend', 'api', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Fix memory leak in Node.js server', desc: 'Profile and fix memory leaks in long-running Node.js processes', tags: ['backend', 'bug'] as Tag[], priority: 'high' as Priority },
//   { title: 'Add database backup automation', desc: 'Set up automated daily backups with point-in-time recovery capability', tags: ['backend', 'database', 'devops'] as Tag[], priority: 'high' as Priority },
//   
//   // DevOps tasks
//   { title: 'Set up CI/CD pipeline', desc: 'Configure GitHub Actions for automated testing, building, and deployment to production', tags: ['devops', 'feature'] as Tag[], priority: 'high' as Priority },
//   { title: 'Implement Docker containerization', desc: 'Dockerize application with multi-stage builds and optimize image size', tags: ['devops', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Configure Kubernetes deployment', desc: 'Set up Kubernetes cluster with proper resource limits, health checks, and auto-scaling', tags: ['devops', 'feature'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Fix SSL certificate renewal', desc: 'Resolve SSL certificate auto-renewal issues with Let\'s Encrypt', tags: ['devops', 'bug'] as Tag[], priority: 'high' as Priority },
//   { title: 'Implement monitoring and alerting', desc: 'Set up Prometheus and Grafana for application and infrastructure monitoring', tags: ['devops', 'feature'] as Tag[], priority: 'high' as Priority },
//   { title: 'Optimize CDN configuration', desc: 'Configure CloudFront/Cloudflare for better caching and faster content delivery', tags: ['devops', 'feature'] as Tag[], priority: 'low' as Priority },
//   { title: 'Set up log aggregation', desc: 'Implement ELK stack (Elasticsearch, Logstash, Kibana) for centralized logging', tags: ['devops', 'feature'] as Tag[], priority: 'medium' as Priority },
//   
//   // Testing tasks
//   { title: 'Write unit tests for auth module', desc: 'Achieve 80%+ code coverage for authentication and authorization logic', tags: ['testing', 'backend'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Add E2E tests with Playwright', desc: 'Implement end-to-end tests covering critical user journeys', tags: ['testing', 'frontend'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Fix flaky integration tests', desc: 'Investigate and fix intermittently failing integration tests in CI pipeline', tags: ['testing', 'bug'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Implement visual regression testing', desc: 'Set up Percy or Chromatic for automated visual regression testing', tags: ['testing', 'frontend'] as Tag[], priority: 'low' as Priority },
//   { title: 'Add load testing with k6', desc: 'Create load testing scenarios to identify performance bottlenecks', tags: ['testing', 'backend'] as Tag[], priority: 'low' as Priority },
//   
//   // Design tasks
//   { title: 'Design new onboarding flow', desc: 'Create wireframes and mockups for improved user onboarding experience', tags: ['design', 'ui/ux'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Create design system documentation', desc: 'Document component library with Storybook including usage guidelines', tags: ['design', 'ui/ux', 'frontend'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Redesign dashboard layout', desc: 'Modernize dashboard UI with better data visualization and user experience', tags: ['design', 'ui/ux'] as Tag[], priority: 'low' as Priority },
//   { title: 'Conduct usability testing', desc: 'Plan and execute usability testing sessions with 5-10 users', tags: ['design', 'ui/ux'] as Tag[], priority: 'medium' as Priority },
//   
//   // Bug fixes
//   { title: 'Fix login form validation error', desc: 'Resolve issue where email validation accepts invalid formats', tags: ['bug', 'frontend'] as Tag[], priority: 'high' as Priority },
//   { title: 'Resolve CORS errors in production', desc: 'Fix cross-origin resource sharing configuration for production API', tags: ['bug', 'backend'] as Tag[], priority: 'high' as Priority },
//   { title: 'Fix pagination bug in search results', desc: 'Correct pagination logic that causes duplicate results on certain pages', tags: ['bug', 'backend', 'api'] as Tag[], priority: 'medium' as Priority },
//   { title: 'Resolve mobile scroll issues', desc: 'Fix body scroll lock issues on mobile when modal is open', tags: ['bug', 'frontend'] as Tag[], priority: 'medium' as Priority },
// ];

// /**
//  * Generate random tasks from templates
//  */
// function generateTasks(count: number): Task[] {
//   const tasks: Task[] = [];
//   const statuses: Status[] = ['todo', 'in_progress', 'in_review', 'done'];
//   const now = new Date();

//   for (let i = 0; i < count; i++) {
//     const template = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
    
//     // Assign all tasks to Hải Anh
//     const assigneeId = MOCK_USERS[0].id;

//     // 70% chance of having a due date
//     let dueDate: string | undefined;
//     if (Math.random() > 0.3) {
//       const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
//       dueDate = toISODate(addDays(now, daysOffset));
//     }

//     // Created date: random within last 60 days
//     const createdDaysAgo = Math.floor(Math.random() * 60);
//     const createdAt = subDays(now, createdDaysAgo).toISOString();
    
//     // Updated date: between created and now
//     const updatedDaysAgo = Math.floor(Math.random() * createdDaysAgo);
//     const updatedAt = subDays(now, updatedDaysAgo).toISOString();

//     tasks.push({
//       id: generateId(),
//       title: `${template.title} ${i > TASK_TEMPLATES.length - 1 ? `(#${Math.floor(i / TASK_TEMPLATES.length) + 1})` : ''}`,
//       description: template.desc,
//       status,
//       priority: template.priority,
//       tags: template.tags,
//       assigneeId,
//       dueDate,
//       createdAt,
//       updatedAt,
//       order: (i + 1) * 1000,
//     });
//   }

//   return tasks;
// }

// /**
//  * Generate activities based on tasks
//  */
// function generateActivities(tasks: Task[]): Activity[] {
//   const activities: Activity[] = [];

//   tasks.slice(0, 50).forEach((task) => {
//     // Create activity
//     activities.push({
//       id: generateId(),
//       type: 'create',
//       taskId: task.id,
//       userId: task.assigneeId,
//       timestamp: task.createdAt,
//       message: `created task "${task.title}"`,
//     });

//     // Random status changes
//     if (task.status !== 'todo' && Math.random() > 0.5) {
//       activities.push({
//         id: generateId(),
//         type: 'status_change',
//         taskId: task.id,
//         userId: task.assigneeId,
//         timestamp: task.updatedAt,
//         message: `moved task to ${task.status.replace('_', ' ')}`,
//       });
//     }
//   });

//   return activities.sort((a, b) => 
//     new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//   );
// }

/**
 * Seed database with initial data
 */
export async function seedDatabase(): Promise<void> {
  // Add users
  await db.users.bulkAdd(MOCK_USERS);

  // Start with 0 tasks - user will create their own
  const tasks: Task[] = [];
  const activities: Activity[] = [];
  
  console.log(`✅ Seeded database with ${tasks.length} tasks, ${MOCK_USERS.length} user(s), and ${activities.length} activities`);
  console.log(`👤 User: ${MOCK_USERS[0].name} (${MOCK_USERS[0].role})`);
}

/**
 * Load all data from database
 */
export async function loadFromDatabase() {
  const [users, tasks, activities] = await Promise.all([
    db.users.toArray(),
    db.tasks.toArray(),
    db.activities.orderBy('timestamp').reverse().toArray(),
  ]);

  return { users, tasks, activities };
}

/**
 * Get mock users for reference
 */
export function getMockUsers(): User[] {
  return MOCK_USERS;
}

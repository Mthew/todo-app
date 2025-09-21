// Task schemas placeholder - requires Zod installation
// TODO: Install zod and implement task validation schemas

// import { z } from 'zod';

// Task form schema
// export const taskSchema = z.object({
//   title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
//   description: z.string().optional(),
//   priority: z.enum(['low', 'medium', 'high']).default('medium'),
//   status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
//   dueDate: z.string().optional(),
//   categoryId: z.string().optional(),
//   tags: z.array(z.string()).optional(),
// });

// export type TaskFormData = z.infer<typeof taskSchema>;

import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['client', 'crew']).optional(),
    phone: z.string().optional(),
  }),
});

export const eventSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    type: z.string(),
    eventDate: z.string(),
    location: z.string(),
    notes: z.string().optional(),
    totalAmount: z.number().optional(),
    dpAmount: z.number().optional(),
    equipment: z.array(z.object({
      equipmentId: z.number(),
      quantity: z.number(),
    })).optional(),
    crew: z.array(z.object({
      crewId: z.number(),
      task: z.string().optional(),
    })).optional(),
  }),
});

export const paymentSchema = z.object({
  body: z.object({
    eventId: z.number(),
    amount: z.number(),
    paymentType: z.enum(['dp', 'pelunasan']),
    status: z.enum(['paid', 'unpaid']).optional(),
    proofUrl: z.string().url().optional().or(z.literal('')),
  }),
});

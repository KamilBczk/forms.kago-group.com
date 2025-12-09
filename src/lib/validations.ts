import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string()
    .email('Veuillez entrer une adresse email valide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  phone: z.string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères'),
  services: z.object({
    website: z.boolean().optional(),
    custom: z.boolean().optional(),
    design: z.boolean().optional(),
    consulting: z.boolean().optional(),
    seo: z.boolean().optional(),
    support: z.boolean().optional(),
  }).refine((services) => {
    return Object.values(services).some(service => service === true);
  }, {
    message: "Veuillez sélectionner au moins un service",
  }),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères'),
  // Métadonnées du navigateur et de la session
  userAgent: z.string().max(500).optional(),
  ipAddress: z.string().max(45).optional(), // IPv6 max length
  referrer: z.string().max(2048).optional(),
  route: z.string().max(500).optional(),
  timestamp: z.string().max(50).optional(),
  browserLanguage: z.string().max(50).optional(),
  screenResolution: z.string().max(50).optional(),
  timezone: z.string().max(100).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

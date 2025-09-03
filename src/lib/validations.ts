import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer une adresse email valide'),
  phone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères'),
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
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  // Métadonnées du navigateur et de la session
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  referrer: z.string().optional(),
  route: z.string().optional(),
  timestamp: z.string().optional(),
  browserLanguage: z.string().optional(),
  screenResolution: z.string().optional(),
  timezone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

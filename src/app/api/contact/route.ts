import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting: Map pour stocker les tentatives par IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // 3 requêtes par minute max

// Fonction de sanitization pour prévenir les attaques XSS dans les emails
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Fonction de rate limiting
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Nouveau ou expiré, créer un nouveau record
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Limite atteinte
    return { allowed: false, resetTime: record.resetTime };
  }

  // Incrémenter le compteur
  record.count++;
  return { allowed: true };
}

// Nettoyer les anciennes entrées toutes les 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    // Extraire l'IP du client pour le rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Vérifier le rate limiting
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      const retryAfter = rateLimitCheck.resetTime
        ? Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)
        : 60;

      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    // Récupérer les données du formulaire
    const body = await request.json();

    // Ajouter les métadonnées du navigateur et de la requête
    const userAgent = request.headers.get('user-agent') || 'User-Agent non disponible';
    const referrer = request.headers.get('referer') || 'Référent non disponible';

    const formDataWithMetadata = {
      ...body,
      ipAddress: clientIP,
      userAgent,
      referrer,
      route: '/letter',
      timestamp: new Date().toISOString(),
    };

    // Validation avec Zod
    const validatedData = contactFormSchema.parse(formDataWithMetadata);

    // Préparer le contenu de l'email
    const selectedServices = Object.entries(validatedData.services)
      .filter(([, selected]) => selected)
      .map(([service]) => {
        const serviceNames: { [key: string]: string } = {
          website: 'Création de site web',
          custom: 'Développement sur mesure',
          design: 'UI/UX Design',
          consulting: 'Consulting & stratégie digitale',
          seo: 'SEO & visibilité',
          support: 'Maintenance & support'
        };
        return serviceNames[service];
      })
      .join(', ');

    // Sanitize all user input to prevent XSS attacks
    const emailContent = `
      <h2>Nouveau contact depuis le formulaire /letter</h2>

      <h3>Informations du contact :</h3>
      <p><strong>Nom :</strong> ${escapeHtml(validatedData.lastName)}</p>
      <p><strong>Prénom :</strong> ${escapeHtml(validatedData.firstName)}</p>
      <p><strong>Email :</strong> ${escapeHtml(validatedData.email)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(validatedData.phone)}</p>

      <h3>Services demandés :</h3>
      <p>${escapeHtml(selectedServices || 'Aucun service sélectionné')}</p>

      <h3>Message :</h3>
      <p>${escapeHtml(validatedData.message)}</p>

      <hr>

      <h3>Métadonnées techniques :</h3>
      <p><strong>Adresse IP :</strong> ${escapeHtml(validatedData.ipAddress || 'Non disponible')}</p>
      <p><strong>User-Agent :</strong> ${escapeHtml(validatedData.userAgent || 'Non disponible')}</p>
      <p><strong>Référent :</strong> ${escapeHtml(validatedData.referrer || 'Non disponible')}</p>
      <p><strong>Route :</strong> ${escapeHtml(validatedData.route || 'Non disponible')}</p>
      <p><strong>Horodatage :</strong> ${escapeHtml(validatedData.timestamp || 'Non disponible')}</p>
      ${validatedData.browserLanguage ? `<p><strong>Langue du navigateur :</strong> ${escapeHtml(validatedData.browserLanguage)}</p>` : ''}
      ${validatedData.screenResolution ? `<p><strong>Résolution d'écran :</strong> ${escapeHtml(validatedData.screenResolution)}</p>` : ''}
      ${validatedData.timezone ? `<p><strong>Fuseau horaire :</strong> ${escapeHtml(validatedData.timezone)}</p>` : ''}
    `;

    // Envoyer l'email via Resend
    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: process.env.CONTACT_EMAIL || 'contact@yourdomain.com',
      subject: `Nouveau contact : ${escapeHtml(validatedData.firstName)} ${escapeHtml(validatedData.lastName)}`,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Formulaire envoyé avec succès', emailId: emailResponse.data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur API contact:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données du formulaire invalides', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

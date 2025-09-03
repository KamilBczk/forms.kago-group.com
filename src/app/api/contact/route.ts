import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const body = await request.json();
    
    // Ajouter les métadonnées du navigateur et de la requête
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'IP non disponible';
    
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
      .filter(([_, selected]) => selected)
      .map(([service, _]) => {
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

    const emailContent = `
      <h2>Nouveau contact depuis le formulaire /letter</h2>
      
      <h3>Informations du contact :</h3>
      <p><strong>Nom :</strong> ${validatedData.lastName}</p>
      <p><strong>Prénom :</strong> ${validatedData.firstName}</p>
      <p><strong>Email :</strong> ${validatedData.email}</p>
      <p><strong>Téléphone :</strong> ${validatedData.phone}</p>
      
      <h3>Services demandés :</h3>
      <p>${selectedServices || 'Aucun service sélectionné'}</p>
      
      <h3>Message :</h3>
      <p>${validatedData.message}</p>
      
      <hr>
      
      <h3>Métadonnées techniques :</h3>
      <p><strong>Adresse IP :</strong> ${validatedData.ipAddress}</p>
      <p><strong>User-Agent :</strong> ${validatedData.userAgent}</p>
      <p><strong>Référent :</strong> ${validatedData.referrer}</p>
      <p><strong>Route :</strong> ${validatedData.route}</p>
      <p><strong>Horodatage :</strong> ${validatedData.timestamp}</p>
      ${validatedData.browserLanguage ? `<p><strong>Langue du navigateur :</strong> ${validatedData.browserLanguage}</p>` : ''}
      ${validatedData.screenResolution ? `<p><strong>Résolution d'écran :</strong> ${validatedData.screenResolution}</p>` : ''}
      ${validatedData.timezone ? `<p><strong>Fuseau horaire :</strong> ${validatedData.timezone}</p>` : ''}
    `;

    // Envoyer l'email via Resend
    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: process.env.CONTACT_EMAIL || 'contact@yourdomain.com',
      subject: `Nouveau contact : ${validatedData.firstName} ${validatedData.lastName}`,
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

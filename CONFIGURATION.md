# Configuration du Formulaire de Contact

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# Configuration Resend pour l'envoi d'emails
RESEND_API_KEY=your_resend_api_key_here

# Email de destination pour les formulaires de contact
CONTACT_EMAIL=contact@yourdomain.com

# Email d'expéditeur (doit être vérifié dans Resend)
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Configuration Resend

1. Créez un compte sur [Resend](https://resend.com)
2. Obtenez votre clé API dans le dashboard
3. Vérifiez votre domaine d'envoi d'emails
4. Configurez l'email d'expéditeur (RESEND_FROM_EMAIL) avec un domaine vérifié

## Fonctionnalités du formulaire

Le formulaire de contact `/letter` capture automatiquement :

### Données du formulaire

- Nom et prénom
- Email et téléphone
- Services sélectionnés
- Message

### Métadonnées du navigateur

- User-Agent (type de navigateur)
- Adresse IP
- Référent (page précédente)
- Route actuelle
- Horodatage
- Langue du navigateur
- Résolution d'écran
- Fuseau horaire

### Validation

- Validation côté client avec Zod
- Validation côté serveur dans l'API
- Messages d'erreur en français
- Gestion des erreurs d'envoi

## Utilisation

1. Installez les dépendances : `npm install`
2. Configurez les variables d'environnement
3. Lancez le serveur de développement : `npm run dev`
4. Testez le formulaire sur `/letter`

## Dépendances ajoutées

- `zod` : Validation des schémas
- `resend` : Service d'envoi d'emails
- `react-hook-form` : Gestion des formulaires React
- `@hookform/resolvers` : Intégration Zod avec React Hook Form

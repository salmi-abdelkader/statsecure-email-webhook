// Webhook pour envoyer des emails via Resend
// Compatible avec Cloudflare Workers et Vercel

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier que c'est une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Récupérer la clé API Resend depuis les variables d'environnement
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY manquante');
      return res.status(500).json({ 
        success: false, 
        error: 'Configuration manquante : RESEND_API_KEY' 
      });
    }

    // Récupérer les données de la requête
    const { type, to, data } = req.body;

    console.log('📧 Webhook appelé:', { type, to, timestamp: new Date().toISOString() });

    // Valider les paramètres requis
    if (!type || !to || !data) {
      return res.status(400).json({ 
        success: false, 
        error: 'Paramètres manquants : type, to, data requis' 
      });
    }

    // Préparer l'email selon le type
    let emailSubject = '';
    let emailHtml = '';

    if (type === 'welcome') {
      const { firstName, lastName, courseInfo, verificationCode } = data;

      // 🔧 CORRECTION : Utiliser courseInfo pour définir le sujet
      if (courseInfo && courseInfo.title) {
        // Email d'inscription à une formation
        emailSubject = `Inscription à la formation : ${courseInfo.title}`;
        emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Inscription Réussie !</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>
      
      <p>Merci de vous être inscrit(e) à la formation :</p>
      
      <div class="info-box">
        <h2>${courseInfo.title}</h2>
        <p><strong>Prix :</strong> ${courseInfo.price} ${courseInfo.currency || 'MAD'}</p>
      </div>

      <h3>📋 Prochaines étapes :</h3>
      <ol>
        <li><strong>Validation de votre inscription</strong> : Notre équipe vérifiera votre demande sous 24-48h</li>
        <li><strong>Instructions de paiement</strong> : Vous recevrez les détails de paiement par email</li>
        <li><strong>Accès à la formation</strong> : Une fois le paiement confirmé, vous recevrez vos identifiants</li>
      </ol>

      <div style="text-align: center;">
        <a href="https://statsecure-academy.com" class="button">Accéder à la plateforme</a>
      </div>

      <p style="margin-top: 30px;">
        <strong>Besoin d'aide ?</strong><br>
        Contactez-nous à <a href="mailto:contact@statsecure-academy.com">contact@statsecure-academy.com</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2024-2025 StatSecure Academy. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`;
      } else {
        // Email de bienvenue générique
        emailSubject = '🎓 Bienvenue sur StatSecure Academy !';
        emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Bienvenue !</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>
      
      <p>Merci de vous être inscrit(e) sur <strong>StatSecure Academy</strong> !</p>
      
      <p>Votre compte a été créé avec succès avec l'adresse email : <strong>${to}</strong></p>

      <h3>🚀 Explorez nos formations :</h3>
      <ul>
        <li>📊 Analyse de données avec SPSS</li>
        <li>🔬 Modélisation avec SmartPLS</li>
        <li>📈 Statistique avancée</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://statsecure-academy.com" class="button">Découvrir les formations</a>
      </div>

      <p style="margin-top: 30px;">
        <strong>Besoin d'aide ?</strong><br>
        Contactez-nous à <a href="mailto:contact@statsecure-academy.com">contact@statsecure-academy.com</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2024-2025 StatSecure Academy. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`;
      }
    } else if (type === 'admin_notification') {
      // Email de notification pour l'admin
      const { firstName, lastName, studentEmail, courseInfo } = data;
      
      emailSubject = `🔔 Nouvelle inscription : ${firstName} ${lastName} - ${courseInfo?.title || 'Inscription générale'}`;
      emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; }
    .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ff6b6b; }
    .button { display: inline-block; background: #667eea; color: white !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 Nouvelle inscription détectée</h2>
    </div>
    <div class="content">
      <h3>Informations de l'étudiant :</h3>
      <div class="info-box">
        <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
        <p><strong>Email :</strong> ${studentEmail}</p>
      </div>

      ${courseInfo ? `
      <h3>Formation demandée :</h3>
      <div class="info-box">
        <p><strong>Titre :</strong> ${courseInfo.title}</p>
        <p><strong>Domaine :</strong> ${courseInfo.domain}</p>
        <p><strong>Prix :</strong> ${courseInfo.price} ${courseInfo.currency || 'MAD'}</p>
      </div>
      ` : ''}

      <h3>Actions requises :</h3>
      <ol>
        <li>Vérifier les informations de l'étudiant</li>
        <li>Valider l'inscription</li>
        <li>Attendre la confirmation de paiement</li>
        <li>Activer l'accès à la formation</li>
      </ol>

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://statsecure-academy.com" class="button">Accéder à l'interface admin</a>
      </div>

      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Note : L'étudiant ne pourra accéder à la formation qu'après validation de votre part.
      </p>
    </div>
  </div>
</body>
</html>`;
    } else {
      return res.status(400).json({ 
        success: false, 
        error: `Type d'email non supporté : ${type}` 
      });
    }

    // Envoyer l'email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: to,
        subject: emailSubject,
        html: emailHtml,
        reply_to: 'contact@statsecure-academy.com'
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('❌ Erreur Resend:', resendData);
      return res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: resendData
      });
    }

    console.log('✅ Email envoyé avec succès:', resendData.id);

    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      emailId: resendData.id
    });

  } catch (error) {
    console.error('❌ Erreur webhook:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

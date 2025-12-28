// Webhook Vercel pour l'envoi d'emails StatSecure Academy
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { type, to, data } = req.body;

    if (!type || !to || !data) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: type, to, data' 
      });
    }

    let emailContent;

    // Template pour email de bienvenue
    if (type === 'welcome') {
      emailContent = {
        from: 'onboarding@resend.dev',
        to: [to],
        replyTo: 'contact@statsecure-academy.com',
        subject: 'Bienvenue sur StatSecure Academy ! 🎉',
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Bienvenue sur StatSecure Academy !</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${data.firstName} ${data.lastName}</strong>,</p>
                <p>Nous sommes ravis de vous accueillir sur <strong>StatSecure Academy</strong> ! 🎉</p>
                <p>Votre compte a été créé avec succès.</p>
                <a href="https://statsecure-academy.com" class="button">Accéder à la plateforme</a>
                <p style="margin-top: 30px;">Contact : <strong>contact@statsecure-academy.com</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 StatSecure Academy</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    // Template pour inscription à une formation
    else if (type === 'course-enrollment') {
      emailContent = {
        from: 'onboarding@resend.dev',
        to: [to],
        replyTo: 'contact@statsecure-academy.com',
        subject: `Inscription à la formation : ${data.courseTitle}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .course-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Inscription à la formation</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${data.firstName} ${data.lastName}</strong>,</p>
                <div class="course-box">
                  <h3>${data.courseTitle}</h3>
                  <p><strong>Prix :</strong> ${data.price} ${data.currency === 'EUR' ? '€' : data.currency}</p>
                </div>
                <a href="https://statsecure-academy.com" class="button">Mon compte</a>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    // Template pour notification admin
    else if (type === 'admin-notification') {
      emailContent = {
        from: 'onboarding@resend.dev',
        to: [to],
        subject: `🔔 Nouvelle inscription : ${data.firstName} ${data.lastName}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #f59e0b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 Nouvelle inscription</h1>
              </div>
              <div class="content">
                <div class="info-box">
                  <strong>Nom :</strong> ${data.firstName} ${data.lastName}<br>
                  <strong>Email :</strong> ${data.email}
                </div>
                <div class="info-box">
                  <strong>Formation :</strong> ${data.courseTitle}<br>
                  <strong>Prix :</strong> ${data.price} ${data.currency === 'EUR' ? '€' : data.currency}
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    else {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email type' 
      });
    }

    // Envoi de l'email via Resend
    const result = await resend.emails.send(emailContent);

    return res.status(200).json({ 
      success: true, 
      emailId: result.data.id,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

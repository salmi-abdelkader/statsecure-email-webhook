# 📧 StatSecure Academy - Webhook d'Envoi d'Emails

## 📋 Description

Ce webhook Vercel gère l'envoi d'emails pour la plateforme StatSecure Academy via l'API Resend.

## 🚀 Pourquoi un Webhook ?

Cloudflare Workers a des limitations qui empêchent l'envoi d'emails directement :
- ⏱️ CPU time limit (10-30ms)
- 🚫 Timeout sur les appels API externes
- ❌ Pas de gestion d'erreurs fiable

Le webhook résout ces problèmes en déportant l'envoi d'emails vers un service externe (Vercel).

## 🛠️ Installation et Déploiement

### **Prérequis**
- Compte Vercel (gratuit) : https://vercel.com
- Clé API Resend : `re_3ztDu6Xj_D6ewaEAUGVEqECJT7dhHFANY`

### **Méthode 1 : Déploiement via Vercel CLI (RECOMMANDÉ)**

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer le webhook
cd /home/user/email-webhook
vercel --prod

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? statsecure-email-webhook
# - Directory? ./
# - Override settings? No

# Le webhook sera déployé sur : https://statsecure-email-webhook.vercel.app
```

### **Méthode 2 : Déploiement via Interface Vercel**

1. Allez sur : https://vercel.com/new
2. Importez ce projet depuis GitHub ou uploadez les fichiers
3. Configurez la variable d'environnement :
   - `RESEND_API_KEY` = `re_3ztDu6Xj_D6ewaEAUGVEqECJT7dhHFANY`
4. Déployez

## 📡 API Endpoint

### **POST /api/send-email**

Envoie un email via Resend.

**Request Body :**
```json
{
  "type": "welcome",
  "to": "user@example.com",
  "data": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Types d'emails disponibles :**

#### **1. Welcome Email (`type: "welcome"`)**
Envoyé lors de l'inscription d'un nouvel utilisateur.

**Data requis :**
```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

#### **2. Course Enrollment (`type: "course-enrollment"`)**
Envoyé lors de l'inscription à une formation.

**Data requis :**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "courseTitle": "SPSS Base",
  "price": "299",
  "currency": "EUR",
  "duration": "20"
}
```

#### **3. Admin Notification (`type: "admin-notification"`)**
Envoyé à l'admin lors d'une nouvelle inscription.

**Data requis :**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "role": "student",
  "courseTitle": "SPSS Base",
  "price": "299",
  "currency": "EUR"
}
```

**Response (Success) :**
```json
{
  "success": true,
  "emailId": "abc123...",
  "message": "Email envoyé avec succès"
}
```

**Response (Error) :**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔗 Intégration avec StatSecure Academy

Une fois le webhook déployé, mettez à jour votre backend Hono dans `/home/user/webapp/src/index.tsx` :

```typescript
// Remplacer les appels directs à Resend par :
const WEBHOOK_URL = 'https://statsecure-email-webhook.vercel.app/api/send-email';

// Lors de l'inscription
const emailResponse = await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'welcome',
    to: email,
    data: { firstName: first_name, lastName: last_name }
  })
});

// Lors de l'inscription à une formation
const emailResponse = await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'course-enrollment',
    to: email,
    data: {
      firstName: first_name,
      lastName: last_name,
      courseTitle: courseData.title,
      price: courseData.price,
      currency: courseData.currency,
      duration: courseData.duration_hours
    }
  })
});
```

## 🧪 Test du Webhook

### **Test manuel avec curl :**

```bash
# Test email de bienvenue
curl -X POST https://statsecure-email-webhook.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "to": "salmi.abdelkader1980@gmail.com",
    "data": {
      "firstName": "Abdelkader",
      "lastName": "Salmi"
    }
  }'

# Réponse attendue :
# {"success":true,"emailId":"abc123...","message":"Email envoyé avec succès"}
```

## 📊 Monitoring

- **Logs Vercel** : https://vercel.com/dashboard → Votre projet → Logs
- **Emails Resend** : https://resend.com/emails
- **Statut Webhook** : https://statsecure-email-webhook.vercel.app/api/send-email (GET retourne 405 Method Not Allowed)

## 🔧 Maintenance

### **Mettre à jour le webhook :**
```bash
cd /home/user/email-webhook
vercel --prod
```

### **Changer la clé API Resend :**
1. Allez sur Vercel Dashboard
2. Projet → Settings → Environment Variables
3. Modifiez `RESEND_API_KEY`
4. Redéployez

## ✅ Avantages de cette Solution

- ✅ **Fiabilité** : Pas de timeout Workers
- ✅ **Logs** : Erreurs visibles dans Vercel
- ✅ **Gratuit** : Plan Vercel gratuit suffisant
- ✅ **Maintenance** : Facile à déboguer et mettre à jour
- ✅ **Évolutivité** : Peut gérer des milliers d'emails

## 📞 Support

Pour toute question : contact@statsecure-academy.com

---

© 2024 StatSecure Academy

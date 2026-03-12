# 🚀 GUIDE DE DÉPLOIEMENT VERCEL

## Pré-requis
- ✅ Compte GitHub (gratuit)
- ✅ Compte Vercel (gratuit)
- ✅ Credentials Supabase

---

## 📋 CHECKLIST AVANT DÉPLOIEMENT

### 1️⃣ Supabase - Récupère tes identifiants

```
1. Va sur https://app.supabase.com → Ton projet
2. Settings → API
3. Copie:
   📍 Project URL:     https://xxx.supabase.co
   🔑 anon public key: eyJ...
```

### 2️⃣ Git - Initialise le repo

```bash
cd C:/Users/marca/harvest-dashboard

# Initialiser Git
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
git init
git add .
git commit -m "🚀 Harvest Videos Dashboard - Ready for Vercel"
```

### 3️⃣ GitHub - Crée un repo et push

```bash
# Va sur https://github.com/new
# Crée un repo: "harvest-dashboard"

# Puis dans le terminal:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harvest-dashboard.git
git push -u origin main
```

### 4️⃣ Vercel - Deploy avec un clic!

#### Option A: Via GitHub (RECOMMANDÉ) ⭐

```
1. Va sur https://vercel.com/import
2. "Importer depuis GitHub"
3. Sélectionne: YOUR_USERNAME/harvest-dashboard
4. Settings → Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL = [Ton Project URL]
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = [Ton anon key]
5. Deploy!
```

#### Option B: Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd C:/Users/marca/harvest-dashboard
vercel --prod \
  --env NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## ✅ APRÈS DÉPLOIEMENT

Tu recevras une URL comme:
```
🎉 https://harvest-dashboard.vercel.app
```

### Test le dashboard:
1. Ouvre l'URL
2. Tu devrais voir:
   - 📊 Stats cards avec les chiffres
   - 📋 Queue vide (aucune vidéo en cours)
   - 📚 Knowledge base vide (aucune vidéo traitée)

### Ajoute une vidéo à traiter:
1. Va sur https://app.supabase.com → Ta base
2. Table: `video_harvest_queue`
3. Ajoute une ligne:
   - `file_name`: Ton vidéo
   - `file_id`: Google Drive file ID
   - `mime_type`: video/mp4
   - `status`: pending

4. **Regarde le dashboard** - Il se mettra à jour en temps réel! 🎬

---

## 🔗 URLs Utiles

| Service | URL |
|---------|-----|
| Dashboard | https://harvest-dashboard.vercel.app |
| Vercel Logs | https://vercel.com/dashboard |
| Supabase | https://app.supabase.com |
| GitHub | https://github.com |

---

## 🐛 Troubleshooting

### "Chargement..." infini
```
✓ Vérifier .env.local avec les bonnes credentials
✓ Vérifier les tables Supabase existent
✓ Ouvrir Console (F12) pour voir les erreurs
```

### Vercel dit "Build failed"
```
✓ Vérifier Node version locale
✓ Lancer npm run build localement pour tester
✓ Vérifier les logs Vercel
```

### Dashboard vide
```
✓ C'est normal si aucune vidéo n'a été traitée!
✓ Ajoute une vidéo dans la queue Supabase
✓ Regarde le dashboard se mettre à jour
```

---

## 📞 SUPPORT

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**C'est tout! Bonne chance avec ton déploiement! 🚀**

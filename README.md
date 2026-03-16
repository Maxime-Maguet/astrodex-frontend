# 🌌 Astrodex — Frontend

> Application mobile de gamification de l'astronomie, développée avec React Native / Expo.

---

## 📱 Aperçu

Astrodex transforme l'observation du ciel en expérience interactive et personnalisée. Grâce à la boussole intégrée et aux capteurs du téléphone, l'utilisateur pointe son appareil vers le ciel pour identifier les astres en temps réel — filtrés selon son équipement d'observation.

**Télécharger l'APK Android** → *[(lien APK)](https://github.com/Maxime-Maguet/astrodex-frontend/releases/tag/v1.0.0)*

---

## ✨ Fonctionnalités

### 🧭 Boussole Astronomique Interactive
- Orientation en temps réel via le **magnétomètre** (Expo Sensors)
- Suivi de la direction de regard avec **watching head** + données de localisation GPS
- Calculs de position des astres via **Astronomy Engine**
- Affichage des objets célestes visibles en fonction de l'orientation et de la position de l'utilisateur

### 🔭 Catalogue d'Astres Personnalisé
- Filtrage des astres visibles selon l'**équipement de l'utilisateur** (œil nu, jumelles, télescope)
- Photos des objets célestes hébergées sur **Cloudinary**
- Données météo en temps réel via **OpenWeather API** pour évaluer les conditions d'observation
- Données astronomiques enrichies via **NASA API**

### 👤 Profil Utilisateur
- Création de compte et authentification
- Photo de profil uploadée sur **Cloudinary**
- Sélection du type d'équipement d'observation (filtre dynamique sur les astres visibles)

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | React Native (Expo SDK 54) |
| State Management | Redux (Redux Toolkit) |
| Navigation | React Navigation |
| Capteurs | Expo Sensors (magnétomètre) |
| Localisation | Expo Location |
| Calculs astronomiques | Astronomy Engine |
| APIs externes | NASA API, OpenWeather API |
| Stockage médias | Cloudinary |
| Backend | Node.js / Express (repo séparé) |

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js ≥ 18
- Yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go (iOS/Android) ou un émulateur

### Installation

```bash
# Cloner le repo sur la branche dev
git clone -b dev https://github.com/Maxime-Maguet/astrodex-frontend.git
cd astrodex-frontend

# Installer les dépendances
yarn install
```

### Lancement

```bash
# Démarrer avec le cache vidé (recommandé)
npx expo start -c
```

> ⚠️ Utiliser uniquement **Yarn** pour éviter les conflits de dépendances.

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
EXPO_PUBLIC_BACKEND_URL=https://astrodex-backend.vercel.app
EXPO_PUBLIC_NASA_API_KEY=votre_clé_nasa
EXPO_PUBLIC_OPENWEATHER_API_KEY=votre_clé_openweather
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
```

---

## 📁 Architecture du projet

```
astrodex-frontend/
├── assets/          # Images, icônes, fonts
├── components/      # Composants réutilisables
├── modules/         # Modules fonctionnels (boussole, capteurs...)
├── reducers/        # Redux reducers (state management)
├── screens/         # Écrans de l'application
├── services/        # Appels API (NASA, OpenWeather, backend)
├── store.js         # Configuration Redux store
└── App.js           # Point d'entrée, navigation
```

---

## 🔗 Liens

- 🔙 Backend : [astrodex-backend](https://github.com/Maxime-Maguet/astrodex-backend)
- 🌐 API déployée : [astrodex-backend.vercel.app](https://astrodex-backend.vercel.app)
- 📦 APK Android : *[(lien APK)](https://github.com/Maxime-Maguet/astrodex-frontend/releases/tag/v1.0.0)*

---

## 👥 Équipe

Projet développé dans le cadre du bootcamp **La Capsule** (2026).  
Lead développeur & porteur du projet : **Maxime Maguet**

---

## 📄 Licence

MIT

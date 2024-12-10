FROM node:18

# Installer curl et netcat pour les healthchecks
RUN apt-get update && apt-get install -y curl netcat-traditional

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 3001

# Démarrer l'application
CMD ["node", "server.js"]
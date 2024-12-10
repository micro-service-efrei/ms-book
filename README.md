Service de gestion de livres

Ce projet propose un service RESTful permettant de gérer une collection de livres. Il est développé en Node.js avec Express, utilise MongoDB pour le stockage des données, Jest pour les tests unitaires, et suit une architecture modulaire (routes, contrôleurs, modèles).
Fonctionnalités :

    Gestion des livres :
        Ajouter un livre
        Supprimer un livre
        Mettre à jour un livre
        Rechercher des livres par titre, auteur ou catégorie
    Gestion des catégories :
        Les catégories sont gérées dans le champ categories de chaque livre.

Technologies :

    Back-end : Node.js + Express
    Base de données : MongoDB (via Mongoose)
    Tests : Jest

Prérequis :

    Node.js (version 14 ou ultérieure)
    npm ou yarn
    MongoDB en local ou hébergé (par exemple : mongodb://127.0.0.1:27017/mylibrary)

Installation :

    Cloner le dépôt ou télécharger le code source :
    git clone https://github.com/votre-username/votre-repo.git
    cd votre-repo

Installer les dépendances :    

    npm install

Configurer les variables d’environnement :
Créez un fichier .env à la racine du projet :

    PORT=3000
    MONGODB_URI=mongodb:/....


Lancement

Démarrez votre serveur :

    npm start

Vous devriez voir :
Serveur en cours d'exécution sur le port 3000
Connecté à MongoDB


Utilisation de l'API

Ajouter un livre :
POST http://localhost:3000/books
Corps JSON exemple :

    { "title": "Le Petit Prince", "author": "Antoine de Saint-Exupéry", "categories": ["Classique", "Enfants"], "publishedDate": "1943-04-06", "description": "Un conte poétique et philosophique"}


Tests
Pour exécuter les tests unitaires :
  
  npm test



    

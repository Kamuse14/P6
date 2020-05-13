So Pekocko est une entreprise familiale de 10 salariés. Son activité principale est la création de sauces piquantes dont la composition est tenue secrète. Forte de son succès, l’entreprise souhaite se développer et créer une application web, dans laquelle les utilisateurs pourront ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres.

**FRONTEND**
Le lien du dépôt GitHub pour la partie frontend est le suivant : https://github.com/OpenClassrooms-Student-Center/dwj-projet6

Rappel procédure
1. Cloner le projet.
2. Exécuter npm install.
3. Exécuter ng serve (requiert la CLI Angular).
4. Adresse du site http://localhost:4200/
5. Exécution de l’API sur http://localhost:3000 .

**BACKEND**
Deux types de droits administrateur à la base de données ont été définis: 
1. un accès pour supprimer ou modifier des tables
2. un accès pour éditer le contenu de la base de données, le fichier .env sera accessible via le dossier zippé livré.

Sécurité
En plus des différents types de droits créés non accessibles directement, plusieurs pratiques vont améliorer la sécurité du site :
1. mot de passe chiffré et stocké de manière sécurisée
2. authentifiaction renforcée
3. adresses mails uniques
4. protection contre les attaques de type injection
5. protection contre les attaques de type bruteforce


# StreamTech

Projet de découverte de React, réalisé avec **React + TypeScript (TSX), Vite, Bootstrap et React Router**. L’interface est en français, comme le sujet.

## Lancer le projet

Depuis le dossier `Streamtech` :

```bash
pnpm install
pnpm dev
```

Ouvrir l’adresse affichée dans le terminal (généralement http://localhost:5173).

## Fonctionnalités

- **Films** : films populaire, filtre par genre, réinitialisation des filtres, likes indépendants sur chaque carte.
- **Détails** : affiche, année, note, durée, genres, synopsis et huit membres du casting.
- **Tâches** : chargement de 20 tâches JSONPlaceholder, ajout, modification du titre, case terminée, suppression avec confirmation, filtres et statistiques.
- **Contact** : champs contrôlés, validation du nom, de l’email, du sujet, du message et du consentement ; simulation d’envoi et remise à zéro.
- **Navigation** : liens React Router, menu mobile et page 404.
- **Bonus useContext** : thème clair/sombre sauvegardé dans le navigateur.
- Chargements, messages d’erreur et possibilités de réessayer sur les listes.

## Comprendre les fichiers

```text
src/
  components/    Petits composants réutilisables : cartes, recherche, formulaires…
  contexts/      Partage du thème entre les composants
  pages/         Home, MovieDetails, Todos, Contact
  services/      Requêtes fetch vers TMDB et JSONPlaceholder
  types.ts       Interfaces TypeScript pour les données et les props
  App.tsx        Routes et structure générale
  main.tsx       Point d’entrée et import Bootstrap
  index.css      Quelques styles en complément de Bootstrap
  App.test.tsx   Tests des interactions principales
```

`useState` mémorise les données d’un composant. Les **props** transmettent les données et les fonctions aux composants enfants. `useEffect` charge les données API ; son nettoyage annule les requêtes devenues inutiles. Les listes utilisent `.map()` et un identifiant comme `key`. Les champs des formulaires utilisent `value` (ou `checked`) et `onChange`.

Le code garde la version des tâches avec `useState` pour rester proche des premières étapes du cours. La variante bonus `useReducer` n’est pas nécessaire à son fonctionnement.

## APIs et limites de l’exercice

La clé TMDB fournie dans le sujet est utilisée par défaut. Pour la remplacer, copier `.env.example` dans `.env.local`, renseigner `VITE_TMDB_API_KEY`, puis redémarrer Vite. Une variable Vite est visible côté navigateur.

Les listes affichent la première page de résultats TMDB. La recherche réinitialise le genre et le choix d’un genre réinitialise la recherche, comme dans le sujet.

**JSONPlaceholder simule les écritures** : les tâches reviennent à leur état initial quand on quitte ou recharge la page. Les nouvelles tâches reçoivent un identifiant local unique, car l’API renvoie toujours le même identifiant lors d’un ajout. Leurs modifications restent locales ; celles des tâches initiales utilisent PATCH et DELETE.

Le formulaire de contact simule un envoi pendant 1,5 seconde. Aucun email n’est envoyé ; les coordonnées de contact sont fictives et viennent du sujet.

## Vérifications

```bash
pnpm build
pnpm lint
pnpm test
```

Les cinq tests utilisent Vitest et React Testing Library avec des réponses API simulées : films et casting, tâches CRUD, contact, thème/menu/404 et erreur réseau. Ils ne remplacent pas une vérification visuelle sur téléphone et ordinateur.

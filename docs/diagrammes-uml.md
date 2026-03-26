# Diagrammes UML — BizConnect Cameroun

> **Niveau** : Licence 2 — Génie Logiciel  
> **Notation** : UML 2.0 (conventions Laurent Audibert)  
> **Projet** : Plateforme de mise en relation entreprises/clients

---

## 1. Diagramme de Cas d'Utilisation

Le diagramme de cas d'utilisation décrit les **fonctionnalités observables** du système du point de vue de ses acteurs. On y distingue deux acteurs principaux et un acteur secondaire (le système d'authentification).

### 1.1 Identification des acteurs

| Acteur | Type | Description |
|--------|------|-------------|
| **Visiteur** | Principal | Utilisateur non authentifié naviguant sur la plateforme |
| **Client** | Principal | Utilisateur authentifié avec le rôle `client` |
| **Entreprise** | Principal | Utilisateur authentifié avec le rôle `entreprise` |
| **Système Auth** | Secondaire | Système d'authentification externe (Google OAuth, Better-Auth) |

### 1.2 Diagramme

```mermaid
graph TB
    subgraph Système["Système BizConnect Cameroun"]
        direction TB

        UC1["Consulter l'annuaire<br/>des entreprises"]
        UC2["Rechercher une<br/>entreprise"]
        UC3["Consulter le profil<br/>d'une entreprise"]

        UC4["S'inscrire"]
        UC5["S'authentifier"]
        UC5a["S'authentifier<br/>par email/mot de passe"]
        UC5b["S'authentifier<br/>via Google OAuth"]
        UC6["Choisir son rôle"]

        UC7["Déposer un avis"]
        UC8["Envoyer un message<br/>à une entreprise"]

        UC9["Gérer le profil<br/>de l'entreprise"]
        UC9a["Télécharger un logo"]
        UC9b["Télécharger une<br/>image de couverture"]
        UC10["Gérer les services"]
        UC10a["Ajouter un service"]
        UC10b["Modifier un service"]
        UC10c["Supprimer un service"]
        UC10d["Activer/Désactiver<br/>un service"]
        UC11["Consulter le<br/>tableau de bord"]
        UC12["Consulter les avis<br/>reçus"]

        UC13["Supprimer son compte"]
    end

    Visiteur((" Visiteur"))
    Client((" Client"))
    Entreprise((" Entreprise"))
    Google((" Système Auth<br/>Google"))

    %% Visiteur
    Visiteur --> UC1
    Visiteur --> UC2
    Visiteur --> UC3
    Visiteur --> UC4
    Visiteur --> UC5

    %% Généralisation Authentification
    UC5 --- UC5a
    UC5 --- UC5b

    %% Client hérite du Visiteur
    Client --> UC7
    Client --> UC8
    Client --> UC13
    Client --> UC1
    Client --> UC2
    Client --> UC3

    %% Entreprise
    Entreprise --> UC9
    Entreprise --> UC10
    Entreprise --> UC11
    Entreprise --> UC12
    Entreprise --> UC13

    %% Inclusions
    UC4 -. "«include»" .-> UC6
    UC5b -. "«include»" .-> UC6
    UC9 -. "«extend»" .-> UC9a
    UC9 -. "«extend»" .-> UC9b
    UC10 -. "«include»" .-> UC10a
    UC10 -. "«extend»" .-> UC10b
    UC10 -. "«extend»" .-> UC10c
    UC10 -. "«extend»" .-> UC10d

    %% Acteur secondaire
    UC5b --> Google
```

### 1.3 Description textuelle des cas d'utilisation principaux

#### CU-01 : S'inscrire

| Élément | Description |
|---------|-------------|
| **Acteur principal** | Visiteur |
| **Précondition** | Le visiteur n'a pas de compte |
| **Scénario nominal** | 1. Le visiteur accède à la page d'inscription. 2. Il saisit son nom, email et mot de passe. 3. Il choisit son rôle (Client ou Entreprise). 4. Le système crée le compte et redirige vers la page appropriée. |
| **Scénario alternatif** | 3a. Le visiteur clique sur "Continuer avec Google". Le système redirige vers Google OAuth, puis vers la page de sélection de rôle. |
| **Postcondition** | Un nouveau compte est créé dans le système avec le rôle choisi. |

#### CU-07 : Déposer un avis

| Élément | Description |
|---------|-------------|
| **Acteur principal** | Client (authentifié) |
| **Précondition** | Le client est connecté et consulte le profil d'une entreprise |
| **Scénario nominal** | 1. Le client attribue une note (1 à 5). 2. Il rédige un commentaire (optionnel). 3. Il valide. 4. Le système enregistre l'avis et met à jour la note moyenne. |
| **Postcondition** | L'avis est visible sur le profil de l'entreprise. |

#### CU-09 : Gérer le profil de l'entreprise

| Élément | Description |
|---------|-------------|
| **Acteur principal** | Entreprise (authentifié) |
| **Précondition** | L'entreprise est connectée à son tableau de bord |
| **Scénario nominal** | 1. L'entreprise accède à la page "Profil". 2. Elle remplit/modifie les champs (nom, description, catégorie, ville, contact). 3. Elle peut télécharger un logo et/ou une image de couverture (extension). 4. Elle clique "Enregistrer". 5. Le système upload les images vers Vercel Blob, enregistre les URLs en base. |
| **Postcondition** | Le profil est mis à jour et visible publiquement. |

#### CU-13 : Supprimer son compte

| Élément | Description |
|---------|-------------|
| **Acteur principal** | Client ou Entreprise (authentifié) |
| **Précondition** | L'utilisateur est connecté |
| **Scénario nominal** | 1. L'utilisateur accède aux "Paramètres". 2. Il clique "Supprimer mon compte". 3. Le système affiche un dialogue de confirmation. 4. L'utilisateur tape "SUPPRIMER" pour confirmer. 5. Le système supprime le compte et toutes les données associées (cascade SQL). |
| **Postcondition** | Le compte et toutes les données liées sont définitivement supprimés. |

---

## 2. Diagramme de Classes

Le diagramme de classes modélise la **structure statique** du système. Il représente les entités métier, leurs attributs, leurs opérations et les associations qui les relient.

### 2.1 Conventions utilisées

- Les **types** sont notés après `:` (convention UML standard)
- La **visibilité** est indiquée par : `+` (public), `-` (privé), `#` (protégé)
- Les **multiplicités** sont notées sur chaque extrémité d'association
- Les **compositions** (losange plein ◆) indiquent qu'un objet ne peut exister sans son conteneur
- Les **agrégations** (losange vide ◇) indiquent un lien fort sans dépendance existentielle
- Le stéréotype `«enumeration»` est utilisé pour les types énumérés

### 2.2 Diagramme

```mermaid
classDiagram
    direction TB

    class Utilisateur {
        -id : String
        -nom : String
        -email : String
        -emailVerifie : Boolean
        -image : String [0..1]
        -role : RoleUtilisateur
        -motDePasse : String [0..1]
        -dateCreation : DateTime
        -dateMaj : DateTime
        +sInscrire(nom, email, mdp, role) : Utilisateur
        +seConnecter(email, mdp) : Session
        +seConnecterViaGoogle() : Session
        +supprimerCompte() : void
        +mettreAJourRole(role) : void
    }

    class RoleUtilisateur {
        <<enumeration>>
        CLIENT
        ENTREPRISE
    }

    class Session {
        -id : String
        -token : String
        -dateExpiration : DateTime
        -adresseIP : String [0..1]
        -userAgent : String [0..1]
        -dateCreation : DateTime
    }

    class CompteExterne {
        -id : String
        -idDuCompte : String
        -fournisseur : String
        -tokenAcces : String [0..1]
        -tokenRafraichissement : String [0..1]
        -dateCreation : DateTime
    }

    class Categorie {
        -id : String
        -nom : String
        -slug : String
        -icone : String [0..1]
        -couleur : String [0..1]
        -description : String [0..1]
        -dateCreation : DateTime
        +listerEntreprises() : Entreprise[*]
    }

    class Entreprise {
        -id : String
        -nom : String
        -slug : String
        -description : String [0..1]
        -ville : String
        -quartier : String [0..1]
        -adresse : String [0..1]
        -telephone : String [0..1]
        -email : String [0..1]
        -siteWeb : String [0..1]
        -logoUrl : String [0..1]
        -coverUrl : String [0..1]
        -estVerifiee : Boolean
        -estActive : Boolean
        -dateCreation : DateTime
        -dateMaj : DateTime
        +creer(donnees) : Entreprise
        +mettreAJour(donnees) : void
        +telechargerLogo(fichier) : String
        +telechargerCouverture(fichier) : String
    }

    class Service {
        -id : String
        -nom : String
        -description : String [0..1]
        -prix : Integer [0..1]
        -devise : String
        -estActif : Boolean
        -dateCreation : DateTime
        -dateMaj : DateTime
        +creer(donnees) : Service
        +modifier(donnees) : void
        +supprimer() : void
        +activerDesactiver() : void
    }

    class Avis {
        -id : String
        -note : Integer
        -commentaire : String [0..1]
        -dateCreation : DateTime
        +deposer(note, commentaire) : Avis
    }

    class Conversation {
        -id : String
        -dateDernierMessage : DateTime
        -dateCreation : DateTime
        +creer(client, entreprise) : Conversation
    }

    class Message {
        -id : String
        -contenu : String
        -estLu : Boolean
        -dateCreation : DateTime
        +envoyer(contenu) : Message
        +marquerCommeLu() : void
    }

    class Media {
        -id : String
        -url : String
        -type : String
        -alt : String [0..1]
        -dateCreation : DateTime
        +telecharger(fichier) : Media
        +supprimer() : void
    }

    %% === ASSOCIATIONS ===

    Utilisateur "1" --> "0..*" Session : possède >
    Utilisateur "1" --> "0..*" CompteExterne : est lié à >
    Utilisateur "1" --> "0..1" Entreprise : gère >
    Utilisateur --> RoleUtilisateur

    Categorie "0..1" --> "0..*" Entreprise : classifie >

    Entreprise "1" *-- "0..*" Service : propose >
    Entreprise "1" *-- "0..*" Avis : reçoit >
    Entreprise "1" *-- "0..*" Media : possède >
    Entreprise "1" *-- "0..*" Conversation : participe à >

    Utilisateur "1" --> "0..*" Avis : rédige >
    Utilisateur "1" --> "0..*" Conversation : initie >
    Utilisateur "1" --> "0..*" Message : envoie >

    Conversation "1" *-- "0..*" Message : contient >
```

### 2.3 Dictionnaire des classes

| Classe | Description | Cardinalité clé |
|--------|-------------|----------------|
| **Utilisateur** | Représente tout compte inscrit (client ou entreprise). C'est la classe centrale du système d'authentification. | Un utilisateur peut gérer **0 ou 1** entreprise. |
| **Session** | Matérialise une session d'authentification active (cookie HTTP-Only). | Un utilisateur possède **0 à N** sessions actives. |
| **CompteExterne** | Lien entre un utilisateur et un fournisseur OAuth (Google). | Un utilisateur peut avoir **0 à N** comptes externes. |
| **Catégorie** | Secteur d'activité regroupant les entreprises (Construction, Transport, Santé...). | Une catégorie contient **0 à N** entreprises. |
| **Entreprise** | Entité centrale du métier. Représente un prestataire de services référencé. | Une entreprise propose **0 à N** services, reçoit **0 à N** avis. |
| **Service** | Prestation offerte par une entreprise avec un prix indicatif en XAF. | Composition forte : un service n'existe pas sans son entreprise. |
| **Avis** | Évaluation laissée par un client sur une entreprise (note 1-5 + commentaire). | Association ternaire implicite : un client évalue une entreprise. |
| **Conversation** | Canal de communication entre un client et une entreprise. | Composition forte : contient **0 à N** messages. |
| **Message** | Unité de communication au sein d'une conversation. | Composition forte : un message n'existe pas sans sa conversation. |
| **Media** | Fichier multimédia (image, document) associé à une entreprise. | Composition forte : un média n'existe pas sans son entreprise. |

### 2.4 Relations et multiplicités détaillées

| Association | Multiplicité | Type | Justification |
|-------------|-------------|------|---------------|
| Utilisateur → Session | 1..* ← 1 | Association simple | Un utilisateur peut avoir plusieurs sessions (multi-appareils). La suppression du compte entraîne la suppression des sessions (CASCADE). |
| Utilisateur → CompteExterne | 0..* ← 1 | Association simple | Lien OAuth. Un utilisateur peut ne pas avoir de compte externe (inscription classique). |
| Utilisateur → Entreprise | 0..1 ← 1 | Association simple | Un utilisateur de rôle `ENTREPRISE` gère exactement **une** entreprise. Un `CLIENT` en gère **zéro**. |
| Catégorie → Entreprise | 0..* ← 0..1 | Agrégation | Une entreprise peut ne pas avoir de catégorie. Une catégorie regroupe plusieurs entreprises. |
| Entreprise → Service | 0..* ← 1 | **Composition** ◆ | Un service n'a pas de sens sans son entreprise (suppression en cascade). |
| Entreprise → Avis | 0..* ← 1 | **Composition** ◆ | Un avis est lié à une seule entreprise (suppression en cascade). |
| Entreprise → Media | 0..* ← 1 | **Composition** ◆ | Un média appartient à une seule entreprise. |
| Entreprise → Conversation | 0..* ← 1 | **Composition** ◆ | La suppression de l'entreprise supprime les conversations. |
| Conversation → Message | 0..* ← 1 | **Composition** ◆ | Un message n'existe pas en dehors de sa conversation. |
| Utilisateur → Avis | 0..* ← 1 | Association simple | Un client peut déposer plusieurs avis (sur des entreprises différentes). |
| Utilisateur → Message | 0..* ← 1 | Association simple | Un utilisateur (client ou entreprise) peut envoyer plusieurs messages. |

---

## 3. Notes méthodologiques (pour le rapport)

### Pourquoi ces choix de modélisation ?

1. **Héritage vs. Rôle** : Plutôt qu'un héritage `Client` / `Entreprise` qui hérite d'`Utilisateur`, nous avons utilisé un **attribut `role`** de type énumération. Ce choix est justifié car la structure des deux "types" d'utilisateurs est identique dans la base — seuls les droits d'accès diffèrent (approche par rôle, recommandée par Audibert pour les cas où les sous-classes n'ajoutent pas d'attributs spécifiques).

2. **Composition (◆) vs. Association simple** : Les relations `Entreprise → Service`, `Entreprise → Avis`, `Conversation → Message` sont des **compositions** car l'objet composant (Service, Avis, Message) ne peut pas exister indépendamment de son conteneur. Cela se traduit en SQL par `ON DELETE CASCADE`.

3. **Multiplicités** : Elles sont rigoureusement issues du schéma SQL :
   - `NOT NULL` + `REFERENCES` → multiplicité `1` côté référencé
   - Clé étrangère nullable → multiplicité `0..1`
   - Relation one-to-many → `0..*` ou `1..*`

4. **Stéréotypes** : Le `«include»` est utilisé pour les cas d'utilisation obligatoirement exécutés (ex: choisir son rôle fait partie intégrante de l'inscription). Le `«extend»` est utilisé pour les cas optionnels (ex: télécharger un logo lors de la gestion du profil).

---

## 4. Diagrammes de Séquence

Le diagramme de séquence modélise les **interactions temporelles** entre les objets (participants) lors de l'exécution d'un scénario précis. Il met en évidence l'**ordre chronologique** des messages échangés.

### 4.1 DS-01 : Inscription d'un utilisateur (scénario nominal)

Ce diagramme décrit le processus complet d'inscription, depuis la saisie du formulaire jusqu'à la redirection.

#### Participants

| Participant | Type | Stéréotype |
|-------------|------|------------|
| **Visiteur** | Acteur principal | `«actor»` |
| **Page Inscription** | Interface utilisateur | `«boundary»` |
| **Contrôleur Auth** | Logique métier | `«control»` |
| **Better-Auth** | Système d'authentification | `«control»` |
| **Base de données** | Couche de persistance | `«entity»` |

#### Diagramme

```mermaid
sequenceDiagram
    actor V as Visiteur
    participant PI as Page Inscription<br/>«boundary»
    participant CA as Contrôleur Auth<br/>«control»
    participant BA as Better-Auth<br/>«control»
    participant BD as Base de données<br/>«entity»

    V->>PI: accéder(/register)
    PI-->>V: afficher formulaire (nom, email, mot de passe)

    V->>PI: saisir(nom, email, motDePasse)
    V->>PI: cliquer "Continuer"

    PI->>CA: validerFormulaire(nom, email, mdp)

    Note over CA: Validation Zod<br/>(schéma registerSchema)

    alt Validation échoue
        CA-->>PI: erreur("Champ invalide")
        PI-->>V: afficher erreurs en rouge
    else Validation OK
        PI-->>V: afficher étape sélection rôle
        V->>PI: choisir rôle ("entreprise")
        V->>PI: cliquer "Créer mon compte"

        PI->>CA: signUp(nom, email, mdp, role)
        CA->>BA: auth.api.signUpEmail(nom, email, mdp, role)

        BA->>BD: INSERT INTO users (id, nom, email, role, ...)
        BD-->>BA: id utilisateur créé

        BA->>BD: INSERT INTO sessions (id, token, userId, ...)
        BD-->>BA: token de session

        BA-->>CA: cookie HTTP-Only (session token)
        CA-->>PI: {success: true}

        PI-->>V: toast "Inscription réussie !"
        PI->>V: redirection → /dashboard
    end
```

#### Fragments combinés

- **alt** `[Validation Zod échoue]` : Le contrôleur renvoie un message d'erreur. Le champ invalide s'affiche en rouge. Le flux s'arrête.
- **alt** `[Email déjà existant]` : Better-Auth détecte un doublon dans la table `users` et renvoie « Cet email est déjà utilisé ».
- **alt** `[Inscription via Google]` : Le visiteur clique « Continuer avec Google ». Le système redirige vers Google OAuth. Après retour, redirection vers `/select-role` pour choisir le rôle (via `updateUserRole`).

---

### 4.2 DS-02 : Mise à jour du profil entreprise avec upload d'images

Ce diagramme décrit la modification du profil incluant le téléchargement d'un logo vers Vercel Blob.

#### Participants

| Participant | Type | Stéréotype |
|-------------|------|------------|
| **Entreprise** | Acteur principal | `«actor»` |
| **Page Profil** | Interface React | `«boundary»` |
| **API Upload** | Route API Next.js | `«control»` |
| **Vercel Blob** | Stockage cloud | `«entity»` |
| **Server Action** | Logique métier | `«control»` |
| **Base de données** | PostgreSQL (Neon) | `«entity»` |

#### Diagramme

```mermaid
sequenceDiagram
    actor E as Entreprise
    participant PP as Page Profil<br/>«boundary»
    participant AU as API Upload<br/>«control»
    participant VB as Vercel Blob<br/>«entity»
    participant SA as Server Action<br/>«control»
    participant BD as Base de données<br/>«entity»

    E->>PP: accéder(/dashboard/profil)

    PP->>SA: getSession()
    SA->>BD: SELECT FROM sessions WHERE token = ?
    BD-->>SA: session {userId, role}
    SA-->>PP: session validée

    PP->>SA: getMyEntreprise()
    SA->>BD: SELECT FROM entreprises WHERE userId = ?
    BD-->>SA: données entreprise existante
    SA-->>PP: entreprise {nom, ville, logoUrl, ...}

    PP-->>E: formulaire pré-rempli

    E->>PP: modifier les champs (nom, description, ...)
    E->>PP: sélectionner un logo (fichier image)

    Note over PP: FileReader.readAsDataURL()<br/>→ aperçu local immédiat

    PP-->>E: aperçu image + badge "Non sauvegardé"

    E->>PP: cliquer "Enregistrer"

    opt logoFile !== null
        PP->>AU: POST /api/upload (FormData: fichier, type: "logo")

        AU->>SA: vérifier session (auth)
        SA-->>AU: session OK

        Note over AU: Validation<br/>type MIME ∈ {jpeg, png, webp}<br/>taille ≤ 2 Mo

        alt Fichier invalide
            AU-->>PP: erreur 400 ("Fichier trop volumineux")
            PP-->>E: toast erreur
        else Fichier valide
            AU->>VB: put(fichier, "logos/{userId}.ext")
            VB-->>AU: {url: "https://blob.vercel-storage.com/..."}
            AU-->>PP: {url: "https://..."}
        end
    end

    PP->>SA: updateEntreprise(id, formData, {logoUrl})

    SA->>BD: SELECT FROM entreprises WHERE id = ? AND userId = ?
    BD-->>SA: entreprise trouvée (propriétaire vérifié)

    SA->>BD: UPDATE entreprises SET nom=..., logo_url=... WHERE id = ?
    BD-->>SA: OK (1 row updated)

    SA-->>PP: {success: true}
    PP-->>E: toast "Profil mis à jour !"
```

#### Fragments combinés

- **opt** `[logoFile ≠ null]` : L'upload vers Vercel Blob n'est déclenché **que si** l'utilisateur a sélectionné un nouveau fichier. Sinon, cette partie est totalement ignorée.
- **opt** `[coverFile ≠ null]` : Même logique pour l'image de couverture (exécuté séquentiellement après le logo).
- **alt** `[Fichier trop volumineux]` : L'API vérifie la taille (logo ≤ 2 Mo, couverture ≤ 5 Mo). Si dépassement → erreur 400.
- **alt** `[Format non supporté]` : Seuls JPEG, PNG, WebP et GIF sont acceptés. Sinon → erreur 400.
- **alt** `[Upload échoue]` : Si Vercel Blob renvoie une erreur (token invalide), le toast affiche l'erreur mais les **champs texte sont tout de même sauvegardés**.

---

### 4.3 Notes méthodologiques — Fragments combinés (Audibert)

Les **fragments combinés** (`alt`, `opt`, `loop`) sont des éléments structurels du diagramme de séquence UML 2.0 :

| Fragment | Équivalent code | Description |
|----------|----------------|-------------|
| **alt** | `if / else` | Alternative : chaque opérande est séparé par une ligne en pointillés avec sa garde `[condition]` |
| **opt** | `if` (sans else) | Optionnel : le contenu n'est exécuté que si la garde est vraie |
| **loop** | `while` / `for` | Boucle : répétition tant que la condition est vraie |
| **par** | `Promise.all()` | Parallèle : les fragments s'exécutent simultanément |

> Ces fragments remplacent avantageusement les multiples scénarios alternatifs textuels en les intégrant **visuellement** dans le flux principal du diagramme.


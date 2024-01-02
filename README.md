# Gestion inventaire

Petit outil pour tenter d'accélérer l'inventaire.

## Contexte

A l'Elefan Grenoble nous utilisons le logiciel [Kaso](https://www.kaso-soft.com/) pour la gestion du stock et de la caisse.

Nous faisons régulièrement des inventaires partiels pour mettre à jour nos stocks. Et un inventaie annuel à la fin de l'année.

Mais cette procédure est chronophage :
* exporter le tableur depuis Kaso
* remplir le tableur, avec pour chaque produit 2 informations à fournir : le stock en magasin, et le stock en réserve (la somme de ces 2 chiffres sera ensuite effectuée)
* réinjecter le tableur dans Kaso (effectuer des vérifications sur les gros écarts avec le stock théorique)

## Idée

L'idée derrière `gestion-inventaire` est d'accélérer l'étape de remplissage du tableur :
* partager en ligne le tableur (grâce à Google Sheet ou rows.com ou autre ?) pour permettre la collaboration (edition simultanée)
* avoir un interface de saisie intutitve : scan du code barre et indiquer la quantité

## Captures d'écran

|Page|Image|
|---|---|
|Ajout article avec code barre unique|![image](https://raw.githubusercontent.com/elefan-grenoble/gestion-inventaire/main/public/images/add-article.png)|
|Ajout article avec code barre partiel|![image](https://raw.githubusercontent.com/elefan-grenoble/gestion-inventaire/main/public/images/add-article-multiple.png)|

## Développement

### Stack technique

* Vue.js 3

### Installation

`yarn install`

### Lancer le projet en local

`yarn dev`

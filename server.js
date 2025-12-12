const express = require('express');
const cors = require('cors');
const fs = require('fs'); //lecture écriture des fichiers JSON
const path = require('path');
const bcrypt = require("bcrypt");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Chemin vers le fichier JSON des produits
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Chemin vers le fichier JSON des utilisateurs
const USERS_FILE = path.join(__dirname, 'users.json');

// 🔹 Lire les produits depuis le fichier à chaque requête
function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture products.json :', err);
    return [];
  }
}

// ---------- UTIL USERS ----------
function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture users.json :', err);
    return [];
  }
}

// 🔹 Écrire les produits dans le fichier (si tu veux ajouter / modifier plus tard)
function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Erreur écriture products.json :', err);
  }
}

// =======================
//   ROUTE LOGIN SIMPLE
// =======================

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "email et password sont obligatoires" });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  // Vérifie le mot de passe hashé
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  return res.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// =======================
//   ROUTES PRODUITS
// =======================

// ➜ Tous les produits
app.get('/products', (req, res) => {
  // On demande au navigateur de NE PAS mettre en cache
  res.set('Cache-Control', 'no-store');

  const products = readProducts();
  res.json(products);
});

// ➜ Un seul produit par id (utile si tu veux l’utiliser plus tard)
app.get('/products/:id', (req, res) => {
  res.set('Cache-Control', 'no-store');

  const products = readProducts();
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  res.json(product);
});

// ➜ Ajouter un produit (pour plus tard si tu veux tester l’écriture)
app.post('/products', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;

const bcrypt = require("bcrypt");

  if (!newProduct.name || typeof newProduct.price !== 'number') {
    return res.status(400).json({ error: 'name (string) et price (number) sont obligatoires' });
  }

  // Génération d’un nouvel id
  newProduct.id = products.length
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// =======================
//   LANCEMENT DU SERVEUR
// =======================

// =======================
//   ROUTES PANIER
// =======================

// ➜ Récupérer le panier d'un utilisateur
app.get("/cart/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const users = readUsers();

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ ok: false, message: "Utilisateur introuvable" });
  }

  res.json({ ok: true, cart: user.cart || [] });
});

// ➜ Sauvegarder le panier d'un utilisateur
app.post("/cart/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const { cart } = req.body;

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ ok: false, message: "Utilisateur introuvable" });
  }

  users[userIndex].cart = cart;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ ok: true, cart });
});

const path = require("path");

// Servir le frontend buildé
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.listen(port, () => {
  console.log("API running on http://localhost:" + port);

  app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "email et password sont obligatoires" });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  // Vérifie le mot de passe hashé
  const match = await bcrypt.compare(password, user.password);

  app.get('/cart/:userId', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.userId));

  app.post('/cart/:userId', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.userId));

  if (!user) {
    return res.status(404).json({ ok: false, message: "Utilisateur non trouvé" });
  }

  // Mise à jour du panier
  user.cart = req.body.cart || [];

  // On réécrit le fichier users.json avec le panier mis à jour
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ ok: true, cart: user.cart });
});

  if (!user) {
    return res.status(404).json({ ok: false, message: "Utilisateur non trouvé" });
  }

  res.json({ ok: true, cart: user.cart || [] });
});

  if (!match) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  return res.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name }
  });
});
});

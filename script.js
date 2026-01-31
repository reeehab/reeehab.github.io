

/* -------------------- DATA -------------------- */
const books = [
  { id: 1, title: "Les Gardiens de la mémoire", author: "Émilie Bernard", category: "clio", muse: "Clio" },
  { id: 2, title: "Chants du crépuscule", author: "Louise Desforêts", category: "calliope", muse: "Calliope" },
  { id: 3, title: "L'Amour en automne", author: "Clara Mercier", category: "erato", muse: "Erato" },
  { id: 4, title: "Le Rire des anges", author: "Joséphine Lenoir", category: "thalia", muse: "Thalia" },
  { id: 5, title: "L'Ombre du passé", author: "Margaux Duvall", category: "melpomene", muse: "Melpomene" },
  { id: 6, title: "Nébuleuses", author: "Astrid Kepler", category: "urania", muse: "Urania" },
  { id: 7, title: "Méditations stellaires", author: "Sonia Richter", category: "polyhymnia", muse: "Polyhymnia" },
  { id: 8, title: "Les Secrets du Louvre", author: "Anne de La Tour", category: "clio", muse: "Clio" },
  { id: 9, title: "Sonnet des étoiles", author: "Léa Poétique", category: "calliope", muse: "Calliope" },
  { id: 10, title: "Une si longue romance", author: "Eva D'Amour", category: "erato", muse: "Erato" }
];

const muses = [
  { id: "clio", name: "Clio", description: "Histoire & Biographie", icon: "fas fa-landmark" },
  { id: "calliope", name: "Calliope", description: "Poésie & Romans", icon: "fas fa-pen-nib" },
  { id: "erato", name: "Erato", description: "Romance", icon: "fas fa-heart" },
  { id: "thalia", name: "Thalia", description: "Comédie", icon: "fas fa-laugh" },
  { id: "melpomene", name: "Melpomene", description: "Tragédie & Drame", icon: "fas fa-mask" },
  { id: "urania", name: "Urania", description: "Science & Science-fiction", icon: "fas fa-star" },
  { id: "polyhymnia", name: "Polyhymnia", description: "Spirituel, Essais & Contemplation", icon: "fas fa-brain" }
];

/* -------------------- DOM -------------------- */
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const musesGrid = document.getElementById("musesGrid");
const booksGrid = document.getElementById("booksGrid");
const categoryButtons = document.querySelectorAll(".category-btn");

const spotlightSlides = document.querySelectorAll(".spotlight-slide");
const spotPrev = document.getElementById("spotPrev");
const spotNext = document.getElementById("spotNext");

const planningRows = document.querySelectorAll(".planning-table tbody tr");
const chips = document.querySelectorAll(".chip");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

/* Members DOM */
const authCard = document.getElementById("authCard");
const memberArea = document.getElementById("memberArea");
const memberName = document.getElementById("memberName");

const tabs = document.querySelectorAll(".tab");
const panelLogin = document.getElementById("panel-login");
const panelSignup = document.getElementById("panel-signup");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutBtn = document.getElementById("logoutBtn");

const shareForm = document.getElementById("shareForm");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookMuse = document.getElementById("bookMuse");
const bookReview = document.getElementById("bookReview");

const myList = document.getElementById("myList");
const myListEmpty = document.getElementById("myListEmpty");

/* Member mini-tabs */
const mTabs = document.querySelectorAll(".m-tab");
const mpAdd = document.getElementById("mp-add");
const mpList = document.getElementById("mp-list");

/* Hero buttons -> members / my list */
const heroButtons = document.querySelectorAll(".hero-buttons a.btn");

/* -------------------- STATE -------------------- */
let currentCategory = "all";
let currentSlide = 0;
let spotlightTimer = null;

let currentUser = null;
let isLoggedIn = false;

const favorites = new Set(); // key = title__author

/* -------------------- HELPERS -------------------- */
function normEmail(v) {
  return (v || "").trim().toLowerCase();
}

function safeScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showToast(message) {
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function bookKey(b) {
  return `${b.title}__${b.author}`;
}

/* -------------------- THEME + NAV -------------------- */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = themeToggle?.querySelector("i");
  if (!icon) return;

  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

function toggleMobileMenu() {
  navLinks?.classList.toggle("active");
}

function closeMobileMenu() {
  navLinks?.classList.remove("active");
}

/* -------------------- COUNTS + RENDER -------------------- */
function updateCounts() {
  muses.forEach(m => (m.count = 0));
  books.forEach(b => {
    const muse = muses.find(m => m.id === b.category);
    if (muse) muse.count++;
  });

  categoryButtons.forEach(btn => {
    const cat = btn.dataset.category;
    const span = btn.querySelector(".category-count");
    if (!span) return;

    if (cat === "all") span.textContent = books.length;
    else span.textContent = books.filter(b => b.category === cat).length;
  });
}

function renderMuses() {
  if (!musesGrid) return;
  musesGrid.innerHTML = "";

  muses.forEach(muse => {
    const card = document.createElement("div");
    card.className = `muse-card ${muse.id}`;
    card.innerHTML = `
      <div class="muse-icon"><i class="${muse.icon}"></i></div>
      <h4>${muse.name}</h4>
      <p>${muse.description}</p>
      <div class="muse-book-count">${muse.count} livre${muse.count > 1 ? "s" : ""}</div>
    `;

    card.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      const targetBtn = document.querySelector(`.category-btn[data-category="${muse.id}"]`);
      if (targetBtn) targetBtn.classList.add("active");

      currentCategory = muse.id;
      renderBooks();
      safeScrollTo("categories");
    });

    musesGrid.appendChild(card);
  });
}

function renderBooks() {
  if (!booksGrid) return;
  booksGrid.innerHTML = "";

  const filtered = currentCategory === "all"
    ? books
    : books.filter(b => b.category === currentCategory);

  if (filtered.length === 0) {
    booksGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:40px;">
        <i class="fas fa-book" style="font-size:3rem; color: var(--primary-color); margin-bottom: 18px;"></i>
        <h3>Aucun livre dans cette catégorie</h3>
        <p>Soyez la première à ajouter un livre pour cette muse !</p>
      </div>
    `;
    return;
  }

  filtered.forEach(book => {
    const key = bookKey(book);
    const inList = favorites.has(key);

    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div class="book-image">
        <i class="fas fa-book-open"></i>
      </div>

      <div class="book-content">
        <h4 class="book-title">${book.title}</h4>
        <span class="book-muse ${book.category}">${book.muse}</span>
        <p><strong>Auteur:</strong> ${book.author}</p>

        <div class="book-actions">
          <button class="add-to-list" type="button" data-key="${key}">
            <i class="fas fa-bookmark"></i>
            ${inList ? "Retirer" : "Ma liste"}
          </button>
        </div>
      </div>
    `;

    const btn = card.querySelector(".add-to-list");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!isLoggedIn) {
        showToast("Connecte-toi pour utiliser “Ma liste”.");
        safeScrollTo("members");
        openAuthTab("login");
        return;
      }

      if (favorites.has(key)) {
        favorites.delete(key);
        showToast("Retiré de ta liste ❌");
      } else {
        favorites.add(key);
        showToast("Ajouté à ta liste ✅");
      }

      renderBooks();
      renderMyList();
    });

    booksGrid.appendChild(card);
  });
}

function renderMyList() {
  if (!myList || !myListEmpty) return;

  myList.innerHTML = "";

  if (favorites.size === 0) {
    myListEmpty.style.display = "block";
    return;
  }

  myListEmpty.style.display = "none";

  [...favorites].forEach(key => {
    const [title, author] = key.split("__");
    const li = document.createElement("li");
    li.innerHTML = `<strong>${title}</strong> — <em>${author}</em>`;
    myList.appendChild(li);
  });
}

/* -------------------- SPOTLIGHT -------------------- */
function resetSpotlightTimer() {
  if (spotlightTimer) clearInterval(spotlightTimer);
  spotlightTimer = setInterval(showNextSlide, 5000);
}

function showPrevSlide() {
  if (!spotlightSlides.length) return;
  spotlightSlides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide - 1 + spotlightSlides.length) % spotlightSlides.length;
  spotlightSlides[currentSlide].classList.add("active");
  resetSpotlightTimer();
}

function showNextSlide() {
  if (!spotlightSlides.length) return;
  spotlightSlides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % spotlightSlides.length;
  spotlightSlides[currentSlide].classList.add("active");
}

/* -------------------- MEMBERS: AUTH LOGIC -------------------- */
const USERS_KEY = "mp_users";
const SESSION_KEY = "mp_session";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function validateSignupQuiz() {
  const selected = document.querySelector('input[name="signupQuiz"]:checked');
  if (!selected) return { ok: false, msg: "Répond au quiz pour créer ton compte." };
  if (!selected.dataset.correct) return { ok: false, msg: "Mauvaise réponse. Réessaie." };
  return { ok: true };
}

function signup(name, email, pass) {
  const users = loadUsers();
  const e = normEmail(email);

  if (users.some(u => normEmail(u.email) === e)) {
    return { ok: false, msg: "Email déjà utilisé. Connecte-toi." };
  }

  const user = { name: name.trim(), email: e, pass };
  users.push(user);
  saveUsers(users);

  const session = { name: user.name, email: user.email };
  setSession(session);

  return { ok: true, user: session };
}

function login(email, pass) {
  const users = loadUsers();
  const e = normEmail(email);

  const user = users.find(u => normEmail(u.email) === e);
  if (!user) return { ok: false, msg: "Email introuvable. Crée un compte." };

  const session = { name: user.name, email: user.email };
  setSession(session);

  return { ok: true, user: session };
}

function openAuthTab(name) {
  tabs.forEach(t => t.classList.remove("active"));
  panelLogin.classList.remove("active");
  panelSignup.classList.remove("active");

  const tab = document.querySelector(`.tab[data-tab="${name}"]`);
  if (tab) tab.classList.add("active");

  if (name === "login") panelLogin.classList.add("active");
  else panelSignup.classList.add("active");
}

function showMemberArea(show) {
  if (!authCard || !memberArea) return;

  if (show) {
    authCard.style.display = "none";
    memberArea.style.display = "block";
    if (memberName && currentUser?.name) memberName.textContent = currentUser.name;
  } else {
    authCard.style.display = "block";
    memberArea.style.display = "none";
  }
}

function openMemberTab(name) {
  mTabs.forEach(t => t.classList.remove("active"));
  mpAdd.classList.remove("active");
  mpList.classList.remove("active");

  document.querySelector(`.m-tab[data-mtab="${name}"]`)?.classList.add("active");
  (name === "add" ? mpAdd : mpList).classList.add("active");
}

/* -------------------- MEMBERS: HANDLERS -------------------- */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;

  const res = login(email, pass);
  if (!res.ok) return showToast(res.msg);

  currentUser = res.user;
  isLoggedIn = true;

  showToast(`Bienvenue ${currentUser.name} ✨`);
  showMemberArea(true);
  renderMyList();
  openMemberTab("list");
}

function handleSignup(e) {
  e.preventDefault();

  const q = validateSignupQuiz();
  if (!q.ok) return showToast(q.msg);

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPass").value;

  if (pass.length < 4) return showToast("Mot de passe trop court (min 4).");

  const res = signup(name, email, pass);
  if (!res.ok) return showToast(res.msg);

  currentUser = res.user;
  isLoggedIn = true;

  showToast("Compte créé ✅ Tu es connectée !");
  showMemberArea(true);
  renderMyList();
  openMemberTab("add");

  signupForm.reset();
  document.querySelectorAll('input[name="signupQuiz"]').forEach(r => (r.checked = false));
}

function handleLogout() {
  clearSession();
  currentUser = null;
  isLoggedIn = false;

  showMemberArea(false);
  openAuthTab("login");
  showToast("Déconnectée ✅");
}

/* Add book */
function handleShareForm(e) {
  e.preventDefault();
  if (!isLoggedIn) {
    showToast("Connecte-toi d’abord.");
    safeScrollTo("members");
    openAuthTab("login");
    return;
  }

  const title = bookTitle.value.trim();
  const author = bookAuthor.value.trim();
  const museId = bookMuse.value;

  if (!title || !author || !museId) {
    showToast("Titre + auteur + muse obligatoires.");
    return;
  }

  const museName = muses.find(m => m.id === museId)?.name || museId;

  books.push({
    id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
    title,
    author,
    category: museId,
    muse: museName
  });

  const avis = bookReview.value.trim();
  showToast(avis ? "Livre + avis envoyé 💬✅" : "Livre ajouté ✅");

  shareForm.reset();
  updateCounts();
  renderMuses();
  renderBooks();
  safeScrollTo("categories");
}

/* -------------------- HERO: “Ma liste” button + chips -------------------- */
function handleHeroMyListClick(e) {
  e.preventDefault();
  safeScrollTo("members");

  if (!isLoggedIn) {
    showToast("Connecte-toi pour voir “Ma liste”.");
    openAuthTab("login");
    return;
  }

  showMemberArea(true);
  openMemberTab("list");
}

function hookHeroButtons() {
  // You have 2 hero buttons: "Rejoindre le club" + "Ma liste"
  // We keep "Rejoindre" as normal anchor to members, but "Ma liste" should check login.
  if (!heroButtons || heroButtons.length < 2) return;

  const joinBtn = heroButtons[0];
  const myListBtn = heroButtons[1];

  // keep join button default but smooth scroll
  joinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    safeScrollTo("members");
    if (!isLoggedIn) openAuthTab("login");
    else openMemberTab("list");
  });

  // “Ma liste” button with login check
  myListBtn.addEventListener("click", handleHeroMyListClick);
}

/* -------------------- INIT -------------------- */
function init() {
  // Theme + menu
  themeToggle?.addEventListener("click", toggleDarkMode);
  menuToggle?.addEventListener("click", toggleMobileMenu);

  // Close mobile menu on nav click
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href")?.slice(1);
      if (id) safeScrollTo(id);
      closeMobileMenu();
    });
  });

  // Chips scroll
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const target = chip.getAttribute("data-target");
      if (target) safeScrollTo(target);
      closeMobileMenu();
    });
  });

  // Planning rows toast
  planningRows.forEach(row => {
    row.addEventListener("click", () => {
      showToast(row.getAttribute("data-details") || "Activité du club ✨");
    });
  });

  // Spotlight
  spotPrev?.addEventListener("click", showPrevSlide);
  spotNext?.addEventListener("click", () => { showNextSlide(); resetSpotlightTimer(); });
  resetSpotlightTimer();

  // Category filter
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderBooks();
    });
  });

  // Auth tabs
  tabs.forEach(t => {
    t.addEventListener("click", () => openAuthTab(t.dataset.tab));
  });

  // Password eye toggles
  document.querySelectorAll(".eye").forEach(b => {
    b.addEventListener("click", () => {
      const id = b.dataset.eye;
      const input = document.getElementById(id);
      if (!input) return;
      input.type = (input.type === "password") ? "text" : "password";
    });
  });

  // Login / signup / logout
  loginForm?.addEventListener("submit", handleLogin);
  signupForm?.addEventListener("submit", handleSignup);
  logoutBtn?.addEventListener("click", handleLogout);

  // Share form
  shareForm?.addEventListener("submit", handleShareForm);

  // Member mini-tabs
  mTabs.forEach(t => t.addEventListener("click", () => openMemberTab(t.dataset.mtab)));

  // Hero buttons (join / my list)
  hookHeroButtons();

  // Restore session
  const session = getSession();
  if (session) {
    currentUser = session;
    isLoggedIn = true;
    showMemberArea(true);
  } else {
    currentUser = null;
    isLoggedIn = false;
    showMemberArea(false);
    openAuthTab("login");
  }

  // Default member tab state (safe)
  openMemberTab("list");

  // Render app
  updateCounts();
  renderMuses();
  renderBooks();
  renderMyList();
}

document.addEventListener("DOMContentLoaded", init);

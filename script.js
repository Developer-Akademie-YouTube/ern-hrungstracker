let entries = [];
let user = JSON.parse(localStorage.getItem('user')) || null;

async function initApp() {
  if (user) {
    await loadEntries();
    showApp();
  } else {
    hideApp();
  }
}

window.onload = initApp;

document.getElementById('add-btn').addEventListener('click', addEntry);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);

async function addEntry() {
  const name = document.getElementById('food-name').value.trim();
  const calories = parseFloat(document.getElementById('calories').value) || 0;
  const protein = parseFloat(document.getElementById('protein').value) || 0;
  const carbs = parseFloat(document.getElementById('carbs').value) || 0;
  const fat = parseFloat(document.getElementById('fat').value) || 0;

  if (!name) return;

  const entry = { name, calories, protein, carbs, fat };
  entries.push(entry);
  await fetch('/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, entry })
  });
  appendRow(entry);
  updateTotals();
  clearInputs();
}

function appendRow(entry) {
  const tbody = document.getElementById('food-body');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.name}</td>
    <td>${entry.calories}</td>
    <td>${entry.protein}</td>
    <td>${entry.carbs}</td>
    <td>${entry.fat}</td>
  `;
  tbody.appendChild(row);
}

function updateTotals() {
  const totals = entries.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  document.getElementById('total-calories').textContent = totals.calories.toFixed(1);
  document.getElementById('total-protein').textContent = totals.protein.toFixed(1);
  document.getElementById('total-carbs').textContent = totals.carbs.toFixed(1);
  document.getElementById('total-fat').textContent = totals.fat.toFixed(1);
}

function clearInputs() {
  document.getElementById('food-name').value = '';
  document.getElementById('calories').value = '';
  document.getElementById('protein').value = '';
  document.getElementById('carbs').value = '';
  document.getElementById('fat').value = '';
}

async function loadEntries() {
  const res = await fetch(`/entries?userId=${user.id}`);
  entries = await res.json();
  const tbody = document.getElementById('food-body');
  tbody.innerHTML = '';
  entries.forEach(appendRow);
  updateTotals();
}

async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    user = data;
    localStorage.setItem('user', JSON.stringify(user));
    await loadEntries();
    showApp();
    document.getElementById('message').textContent = '';
  } else {
    document.getElementById('message').textContent = data.error;
  }
}

async function register() {
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById('message').textContent = data.message || data.error;
}

function logout() {
  user = null;
  localStorage.removeItem('user');
  hideApp();
}

function showApp() {
  document.querySelector('.input-form').style.display = 'flex';
  document.getElementById('food-table').style.display = 'table';
  document.getElementById('logout-btn').style.display = 'inline-block';
  document.getElementById('login-section').style.display = 'none';
}

function hideApp() {
  document.querySelector('.input-form').style.display = 'none';
  document.getElementById('food-table').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}


const entries = JSON.parse(localStorage.getItem('entries')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;

function initApp() {
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID',
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById('signin-button'),
    { theme: 'outline', size: 'large' }
  );
  if (user) {
    showApp();
  } else {
    hideApp();
  }
  entries.forEach((entry) => {
    appendRow(entry);
  });
  updateTotals();
}

window.onload = initApp;

document.getElementById('add-btn').addEventListener('click', addEntry);
document.getElementById('logout-btn').addEventListener('click', logout);

function addEntry() {
  const name = document.getElementById('food-name').value.trim();
  const calories = parseFloat(document.getElementById('calories').value) || 0;
  const protein = parseFloat(document.getElementById('protein').value) || 0;
  const carbs = parseFloat(document.getElementById('carbs').value) || 0;
  const fat = parseFloat(document.getElementById('fat').value) || 0;

  if (!name) return;

  const entry = { name, calories, protein, carbs, fat };
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));
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

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  user = { name: data.name, email: data.email };
  localStorage.setItem('user', JSON.stringify(user));
  showApp();
}

function logout() {
  google.accounts.id.disableAutoSelect();
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

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

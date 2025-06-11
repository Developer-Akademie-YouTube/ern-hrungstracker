const entries = JSON.parse(localStorage.getItem('entries')) || [];

// Render saved entries on load
entries.forEach((entry) => {
  appendRow(entry);
});
updateTotals();

document.getElementById('add-btn').addEventListener('click', addEntry);

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

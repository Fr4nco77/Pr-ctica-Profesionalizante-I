const $ = (selector) => document.querySelector(selector);
const $all = (selector) => document.querySelectorAll(selector);

const calorieCounter = $("#calorie-counter");
const budgetNumberInput = $("#budget");
const entryDropdown = $("#entry-dropdown");
const addEntryButton = $("#add-entry");
const clearButton = $("#clear");
const output = $("#output");
let isError = false;

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", submitForm);
clearButton.addEventListener("click", clearForm);

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return regex.test(str);
}

function addEntry() {
  const targetInputContainer = $(`#${entryDropdown.value} .input-container`);
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">
        Entrada ${entryNumber} Nombre
    </label>
    <input
      type="text"
      id="${entryDropdown.value}-${entryNumber}-name"
      placeholder="Nombre"
    />
    <label for="${entryDropdown.value}-${entryNumber}-calories">
        Entrada ${entryNumber} Calorías
    </label>
    <input
      type="number"
      min="0"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calorías"
    />`;

  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);

    if (currVal === "") continue;

    if (!isInvalidInput(currVal)) {
      const valNumber = Number(currVal);

      if (item.id.includes("exercise")) {
        calories -= valNumber;
      } else {
        calories += valNumber;
      }
    } else {
      alert(`Entrada inválida: ${item.value}`);
      item.value = "";
      isError = true;
    }
  }

  return calories;
}

function calculateCalories(budget, totalCalories) {
  const consumed = totalCalories;
  const remaining = budget - consumed;

  const surplusOrDeficit = remaining < 0 ? "Excedente" : "Déficit";

  output.innerHTML = `
    <span>${Math.abs(remaining)} Calorías de ${surplusOrDeficit.toLowerCase()}</span>
    <p>Presupuesto: ${budget}</p>
    <p>Consumidas/Quemadas: ${consumed}</p>
  `;
  output.classList.remove("hide");
}

function submitForm(e) {
  e.preventDefault();
  isError = false;

  const inputNumberElements = $all(".input-container input[type='number']");
  const totalCalories = getCaloriesFromInputs(inputNumberElements);

  if (isError) return;

  calculateCalories(Number(budgetNumberInput.value), totalCalories);
}

function clearForm() {
  const inputContainers = $all(".input-container");
  inputContainers.forEach((container) => container.replaceChildren());

  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}

function updateTotal() {
  const form = document.getElementById("manpowerForm");
  const fields = form.querySelectorAll("input[type='text']");
  let total = 0;

  fields.forEach(input => {
    const value = input.value.trim();
    if (value && !isNaN(value)) {
      total += Number(value);
    }
  });

  document.getElementById("total").textContent = total;
}

function generateWhatsappText() {
  const date = document.getElementById("date").value;
  if (!date) {
    alert("Please select a date.");
    return;
  }

  const form = document.getElementById("manpowerForm");
  const fields = form.querySelectorAll("input[type='text']");
  let total = 0;
  let text = `*MANPOWER DETAILS*\n*${date}*\n`;

  fields.forEach(input => {
    if (!input.value.trim()) {
      input.value = "N/A";
    }
    const value = input.value.trim();
    const label = input.previousSibling.textContent.trim();

    text += `*${label}*\nManpower-${value}\n`;
    if (value.toUpperCase() !== "N/A" && !isNaN(value)) {
      total += Number(value);
    }
  });

  text += `*Total Manpower*- ${total}`;

  navigator.clipboard.writeText(text).then(() => {
    alert("WhatsApp format text copied to clipboard!");
  });
}

function saveManpowerData() {
  const date = document.getElementById("date").value;
  if (!date) {
    alert("Please select a date to save.");
    return;
  }

  const form = document.getElementById("manpowerForm");
  const fields = form.querySelectorAll("input[type='text']");
  const data = {};

  fields.forEach(input => {
    data[input.name] = input.value.trim();
  });

  localStorage.setItem(`manpower_${date}`, JSON.stringify(data));
  alert("Manpower data saved locally!");
}
document.addEventListener("DOMContentLoaded", () => {
  // Set today's date by default
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("date").value = formattedDate;

  // Attach event listeners for live total updates
  const form = document.getElementById("manpowerForm");
  const fields = form.querySelectorAll("input[type='text']");
  fields.forEach(input => {
    input.addEventListener("input", updateTotal);
  });
});

function loadManpowerData() {
  const date = document.getElementById("date").value;
  if (!date) {
    alert("Please select a date to load.");
    return;
  }

  const data = localStorage.getItem(`manpower_${date}`);
  if (!data) {
    alert("No saved data found for this date.");
    return;
  }

  const parsedData = JSON.parse(data);
  const form = document.getElementById("manpowerForm");

  Object.keys(parsedData).forEach(name => {
    const input = form.querySelector(`input[name="${name}"]`);
    if (input) input.value = parsedData[name];
  });

  updateTotal();
  alert("Previous manpower data loaded!");
}

// Attach event listeners for live total updates
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("manpowerForm");
  const fields = form.querySelectorAll("input[type='text']");
  fields.forEach(input => {
    input.addEventListener("input", updateTotal);
  });
});

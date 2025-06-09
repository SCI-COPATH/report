// Set date input default to today
const dateInput = document.getElementById("date");
dateInput.value = new Date().toISOString().slice(0, 10);

const fields = [
  "mlcp", "ugSump", "southTerminal", "parcelBuilding", "northTerminal", "tempShift",
  "qcLab", "store", "elecPlumb", "mechanic", "smpCamp", "rmcPump",
  "batchingPlant", "security", "driver", "operators"
];

function getNumberValue(id) {
  const val = document.getElementById(id).value.trim();
  return val === "" || val === " " ? "N/A" : Number(val) || 0;
}

function updateTotal() {
  let total = 0;
  fields.forEach((id) => {
    const val = document.getElementById(id).value.trim();
    if (val === "" || val === " ") return; // treat empty or space as 0 for total
    const num = Number(val);
    if (!isNaN(num)) total += num;
  });
  document.getElementById("totalManpower").textContent = total;
}

// Attach input event listeners for total update
fields.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener("input", updateTotal);
});

// Save data to localStorage
document.getElementById("saveBtn").addEventListener("click", () => {
  const data = {
    date: dateInput.value,
    manpower: {}
  };
  fields.forEach(id => {
    const val = document.getElementById(id).value.trim();
    data.manpower[id] = val === "" || val === " " ? "N/A" : val;
  });
  localStorage.setItem("manpowerData", JSON.stringify(data));
  alert("Data saved locally!");
});

// Load data from localStorage
document.getElementById("loadBtn").addEventListener("click", () => {
  const saved = localStorage.getItem("manpowerData");
  if (!saved) {
    alert("No saved data found!");
    return;
  }
  const data = JSON.parse(saved);
  dateInput.value = data.date || new Date().toISOString().slice(0, 10);
  fields.forEach(id => {
    const val = data.manpower[id];
    document.getElementById(id).value = val === "N/A" ? "" : val;
  });
  updateTotal();
  alert("Data loaded!");
});

// Generate WhatsApp text
document.getElementById("generateBtn").addEventListener("click", () => {
  const dateVal = dateInput.value || "N/A";
  let text = `*MANPOWER DETAILS*\n*${dateVal}*\n`;

  text += fields.map((id, idx) => {
    const label = document.querySelector(`label[for=${id}]`).innerText;
    let val = document.getElementById(id).value.trim();
    if (val === "" || val === " ") val = "N/A";
    return `${idx + 1}. ${label}\nManpower-${val}`;
  }).join("\n");

  const total = document.getElementById("totalManpower").textContent;
  text += `\n\n*Total Manpower*- ${total}`;

  document.getElementById("outputText").value = text;
  navigator.clipboard.writeText(text)
    .then(() => {
      console,log("copy")
      // alert("WhatsApp text copied to clipboard!");
    })
    .catch(err => {
      console.error("Could not copy text: ", err);
    });
});

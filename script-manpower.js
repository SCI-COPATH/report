// Default fields and their labels
const defaultFields = [
  { id: "mlcp", label: "MLCP" },
  { id: "ugSump", label: "UG SUMP" },
  { id: "southTerminal", label: "SOUTH TERMINAL" },
  { id: "parcelBuilding", label: "PARCEL BUILDING" },
  { id: "northTerminal", label: "NORTH TERMINAL" },
  { id: "tempShift", label: "TEMPORARY SHIFTING WORK" },
  { id: "qcLab", label: "QC Lab" },
  { id: "store", label: "Store" },
  { id: "elecPlumb", label: "Electrical/Plumbing" },
  { id: "mechanic", label: "Mechanic" },
  { id: "smpCamp", label: "SMP camp" },
  { id: "rmcPump", label: "RMC Pump" },
  { id: "batchingPlant", label: "Batching plant" },
  { id: "security", label: "Security" },
  { id: "driver", label: "Driver" },
  { id: "operators", label: "Operators" },
];

const dateInput = document.getElementById("date");
dateInput.value = new Date().toISOString().slice(0, 10);

const fieldsContainer = document.getElementById("fieldsContainer");
const totalDisplay = document.getElementById("totalManpower");
const addFieldBtn = document.getElementById("addFieldBtn");

let fields = []; // will hold all fields currently on the form, each {id, label, isDefault}

function createFieldElement(id, label, isDefault) {
  const div = document.createElement("div");
  div.className = "form-group";
  div.dataset.fieldId = id;

  // Label
  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", id);
  labelEl.textContent = label;
  div.appendChild(labelEl);

  // Input
  const inputEl = document.createElement("input");
  inputEl.type = "number";
  inputEl.min = "0";
  inputEl.id = id;
  inputEl.placeholder = "Enter manpower";
  div.appendChild(inputEl);

  // Delete button (always visible)
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "❌";
  delBtn.title = "Delete this field";
  delBtn.style.marginLeft = "10px";
  div.appendChild(delBtn);

  // Delete handler
  delBtn.addEventListener("click", () => {
    // Remove from DOM
    div.remove();
    // Remove from fields array
    fields = fields.filter((f) => f.id !== id);
    // Update total
    updateTotal();
  });

  // Update total on input
  inputEl.addEventListener("input", updateTotal);

  return div;
}

function initializeFields() {
  fieldsContainer.innerHTML = "";
  fields = [];
  // Insert default fields
  defaultFields.forEach((f) => {
    fields.push({ id: f.id, label: f.label, isDefault: true });
    const el = createFieldElement(f.id, f.label, true);
    fieldsContainer.appendChild(el);
  });
  updateTotal();
}

function updateTotal() {
  let total = 0;
  fields.forEach(({ id }) => {
    const val = document.getElementById(id)?.value.trim();
    if (val === "" || val === " ") return;
    const num = Number(val);
    if (!isNaN(num)) total += num;
  });
  totalDisplay.textContent = total;
}

function generateUniqueId() {
  // Simple unique id generator for added fields
  return "field_" + Math.random().toString(36).substring(2, 9);
}

// Save data to localStorage
document.getElementById("saveBtn").addEventListener("click", () => {
  const data = {
    date: dateInput.value,
    manpower: {},
  };
  fields.forEach(({ id, label }) => {
    const val = document.getElementById(id)?.value.trim() || "";
    data.manpower[id] = {
      label,
      value: val === "" || val === " " ? "N/A" : val,
    };
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

  // Clear current fields
  fieldsContainer.innerHTML = "";
  fields = [];

  // Load saved fields dynamically
  for (const [id, info] of Object.entries(data.manpower)) {
    fields.push({
      id,
      label: info.label,
      isDefault: defaultFields.some((f) => f.id === id),
    });
    const el = createFieldElement(
      id,
      info.label,
      defaultFields.some((f) => f.id === id)
    );
    fieldsContainer.appendChild(el);
    document.getElementById(id).value = info.value === "N/A" ? "" : info.value;
  }
  updateTotal();
  alert("Data loaded!");
});

// Generate WhatsApp text
document.getElementById("generateBtn").addEventListener("click", () => {
  const dateVal = dateInput.value || "N/A";
  let text = `*MANPOWER DETAILS*\n*${dateVal}*\n`;

  fields.forEach(({ id, label }, idx) => {
    let val = document.getElementById(id)?.value.trim() || "";
    if (val === "" || val === " ") val = "N/A";
    text += `${idx + 1}. ${label}\nManpower-${val}\n`;
  });

  const total = totalDisplay.textContent;
  text += `\n*Total Manpower*- ${total}`;

  document.getElementById("outputText").value = text;

  navigator.clipboard.writeText(text).catch((err) => {
    console.error("Could not copy text: ", err);
  });
});

// Add new field button handler
addFieldBtn.addEventListener("click", () => {
  const inputEl = document.getElementById("newFieldName");
  const newLabel = inputEl.value.trim();
  if (!newLabel) {
    alert("Please enter a name for the new manpower field.");
    inputEl.focus();
    return;
  }

  // Check for duplicate label (optional)
  const duplicate = fields.some(
    (f) => f.label.toLowerCase() === newLabel.toLowerCase()
  );
  if (duplicate) {
    alert("This manpower field already exists.");
    inputEl.focus();
    return;
  }

  const newId = generateUniqueId();
  fields.push({ id: newId, label: newLabel, isDefault: false });
  const el = createFieldElement(newId, newLabel, false);
  fieldsContainer.appendChild(el);
  updateTotal();

  // Clear input
  inputEl.value = "";
  inputEl.focus();
});

// Initialize default fields on page load
initializeFields();

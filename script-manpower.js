// Default fields and their labels (same as before)
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

let fields = []; // { id, label, isDefault }

// Create one manpower field block with:
// - Editable label input (like Tomorrow's Plan heading input)
// - Number input for manpower
// - Delete button
function createFieldElement(id, label, isDefault) {
  const section = document.createElement("section");
  section.className = "heading-section";
  section.dataset.fieldId = id;

  // Editable label input (same style as Tomorrow's Plan)
  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.value = label;
  labelInput.className = "heading-input";
  labelInput.setAttribute("aria-label", "Manpower field name");
  labelInput.title = "Edit manpower field name";
  section.appendChild(labelInput);

  // Number input for manpower count
  const inputEl = document.createElement("input");
  inputEl.type = "number";
  inputEl.min = "0";
  inputEl.placeholder = "Enter manpower";
  inputEl.style.width = "150px";
  inputEl.style.padding = "6px 8px";
  inputEl.style.fontSize = "1rem";
  inputEl.style.borderRadius = "4px";
  inputEl.style.border = "1px solid #ccc";
  inputEl.style.marginBottom = "10px";
  section.appendChild(inputEl);

  // Delete button (red cross, same style as Tomorrow's Plan)
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "remove-btn";
  delBtn.textContent = "✖";
  delBtn.title = "Delete this manpower field";
  section.appendChild(delBtn);

  // Delete handler
  delBtn.addEventListener("click", () => {
    section.remove();
    fields = fields.filter((f) => f.id !== id);
    updateTotal();
  });

  // Update total when manpower input changes
  inputEl.addEventListener("input", updateTotal);

  // Update label in fields array when labelInput changes
  labelInput.addEventListener("input", (e) => {
    const newLabel = e.target.value.trim();
    const index = fields.findIndex((f) => f.id === id);
    if (index !== -1) {
      fields[index].label = newLabel || "Unnamed Field";
    }
  });

  return section;
}

// Initialize default fields on page load
function initializeFields() {
  fieldsContainer.innerHTML = "";
  fields = [];

  defaultFields.forEach((f) => {
    fields.push({ id: f.id, label: f.label, isDefault: true });
    const el = createFieldElement(f.id, f.label, true);
    fieldsContainer.appendChild(el);
  });
  updateTotal();
}

// Update total manpower display
function updateTotal() {
  let total = 0;
  fields.forEach(({ id }) => {
    const section = fieldsContainer.querySelector(`[data-field-id="${id}"]`);
    if (!section) return;
    const inputEl = section.querySelector('input[type="number"]');
    if (!inputEl) return;

    const val = inputEl.value.trim();
    if (val === "" || val === " ") return;

    const num = Number(val);
    if (!isNaN(num)) total += num;
  });
  totalDisplay.textContent = total;
}

// Generate a simple unique id for newly added fields
function generateUniqueId() {
  return "field_" + Math.random().toString(36).substring(2, 9);
}

// Save data to localStorage
document.getElementById("saveBtn").addEventListener("click", () => {
  const data = {
    date: dateInput.value,
    manpower: {},
  };

  fields.forEach(({ id }) => {
    const section = fieldsContainer.querySelector(`[data-field-id="${id}"]`);
    if (!section) return;

    const labelInput = section.querySelector(".heading-input");
    const manpowerInput = section.querySelector('input[type="number"]');

    const label = labelInput?.value.trim() || "Unnamed Field";
    const val = manpowerInput?.value.trim() || "";

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

  fieldsContainer.innerHTML = "";
  fields = [];

  for (const [id, info] of Object.entries(data.manpower)) {
    const isDefault = defaultFields.some((f) => f.id === id);
    fields.push({ id, label: info.label, isDefault });

    const el = createFieldElement(id, info.label, isDefault);
    fieldsContainer.appendChild(el);

    const section = fieldsContainer.querySelector(`[data-field-id="${id}"]`);
    if (section) {
      const manpowerInput = section.querySelector('input[type="number"]');
      manpowerInput.value = info.value === "N/A" ? "" : info.value;
    }
  }
  updateTotal();
  alert("Data loaded!");
});

// Generate WhatsApp text
document.getElementById("generateBtn").addEventListener("click", () => {
  const dateVal = dateInput.value || "N/A";
  let text = `*MANPOWER DETAILS*\n*${dateVal}*\n`;

  fields.forEach(({ id, label }, idx) => {
    const section = fieldsContainer.querySelector(`[data-field-id="${id}"]`);
    if (!section) return;
    const manpowerInput = section.querySelector('input[type="number"]');
    let val = manpowerInput?.value.trim() || "";
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

  // Check duplicate by label (case insensitive)
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

  inputEl.value = "";
  inputEl.focus();
});

// Initialize on page load
initializeFields();

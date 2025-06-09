// Set date input default to tomorrow's date
const dateInput = document.getElementById("date");
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
dateInput.value = tomorrowDate.toISOString().slice(0, 10);

// Sample default headings for tomorrow plan (customize as needed)
const defaultHeadings = [
  "Site Preparation",
  "Material Delivery",
  "Safety Checks",
  "Team Allocation",
  "Equipment Maintenance",
  "Special Instructions",
];

// Container reference
const headingsContainer = document.getElementById("headingsContainer");

function createHeadingSection(name = "", points = [""]) {
  const section = document.createElement("div");
  section.className = "heading-section";

  const headingInput = document.createElement("input");
  headingInput.className = "heading-input";
  headingInput.type = "text";
  headingInput.placeholder = "Enter heading";
  headingInput.value = name;

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "×";
  removeBtn.title = "Remove heading";
  removeBtn.onclick = () => section.remove();

  const pointsList = document.createElement("div");
  pointsList.className = "points-list";

  function addPoint(value = "") {
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Enter working plan point";
    textarea.value = value;
    pointsList.appendChild(textarea);
  }

  points.forEach((p) => addPoint(p));

  const addPointBtn = document.createElement("button");
  addPointBtn.type = "button";
  addPointBtn.textContent = "+ Add Point";
  addPointBtn.onclick = () => addPoint();

  section.appendChild(headingInput);
  section.appendChild(removeBtn);
  section.appendChild(pointsList);
  section.appendChild(addPointBtn);

  return section;
}

function loadDefaultHeadings() {
  defaultHeadings.forEach((h) => {
    headingsContainer.appendChild(createHeadingSection(h));
  });
}

// Save/load buttons
document.getElementById("saveBtn").addEventListener("click", () => {
  const data = {
    date: dateInput.value,
    headings: [],
  };

  const sections = headingsContainer.querySelectorAll(".heading-section");
  sections.forEach((section) => {
    const headingInput = section.querySelector(".heading-input");
    const pointsTextareas = section.querySelectorAll(".points-list textarea");

    const headingName = headingInput.value.trim() || "N/A";
    const points = Array.from(pointsTextareas).map(
      (t) => t.value.trim() || "N/A"
    );

    data.headings.push({ headingName, points });
  });

  localStorage.setItem("tomorrowPlanData", JSON.stringify(data));
  alert("Tomorrow's working plan saved!");
});

document.getElementById("loadBtn").addEventListener("click", () => {
  const saved = localStorage.getItem("tomorrowPlanData");
  if (!saved) {
    alert("No saved data found!");
    return;
  }
  const data = JSON.parse(saved);
  dateInput.value = data.date || tomorrowDate.toISOString().slice(0, 10);
  headingsContainer.innerHTML = "";
  data.headings.forEach(({ headingName, points }) => {
    headingsContainer.appendChild(createHeadingSection(headingName, points));
  });
  alert("Tomorrow's working plan loaded!");
});

document.getElementById("addHeadingBtn").addEventListener("click", () => {
  headingsContainer.appendChild(createHeadingSection());
});

// Generate WhatsApp text
document.getElementById("generateBtn").addEventListener("click", () => {
  const dateVal = dateInput.value || "N/A";
  let text = `*TOMORROW'S WORKING PLAN*\n*${dateVal}*\n`;

  const sections = headingsContainer.querySelectorAll(".heading-section");
  sections.forEach((section, idx) => {
    const headingInput = section.querySelector(".heading-input");
    const pointsTextareas = section.querySelectorAll(".points-list textarea");

    const headingName = headingInput.value.trim() || "N/A";
    text += `\n*${idx + 1}. ${headingName}*\n`;

    pointsTextareas.forEach((ta, pidx) => {
      const val = ta.value.trim() || "N/A";
      text += `${pidx + 1}) ${val}\n`;
    });
  });

  document.getElementById("outputText").value = text;
  navigator.clipboard.writeText(text)
    .then(() => {
      // optional alert or console.log
      // alert("WhatsApp text copied to clipboard!");
    })
    .catch(err => {
      console.error("Could not copy text: ", err);
    });
});

// Load default headings on first load
loadDefaultHeadings();

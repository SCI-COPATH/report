// Set date input default to today
const dateInput = document.getElementById("date");
dateInput.value = new Date().toISOString().slice(0, 10);

const defaultHeadings = [
  "MLCP",
  "UG SUMP",
  "SOUTH TERMINAL",
  "PARCEL BUILDING",
  "NORTH TERMINAL",
  "TEMPORARY SHIFTING WORK",
  "SMR & Dy smr ROOM",
  "Second class waiting hall",
];

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

  // function addPoint(value = "") {
  //   const textarea = document.createElement("textarea");
  //   textarea.placeholder = "Enter progress point";
  //   textarea.value = value;
  //   pointsList.appendChild(textarea);
  // }
  function addPoint(value = "") {
    const pointWrapper = document.createElement("div");
    pointWrapper.className = "point-wrapper";
    pointWrapper.style.display = "flex";
    pointWrapper.style.gap = "10px";
    pointWrapper.style.alignItems = "flex-start";
    pointWrapper.style.marginBottom = "8px";

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Enter progress point";
    textarea.value = value;
    textarea.style.flex = "1";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-point-btn";
    deleteBtn.textContent = "×";
    deleteBtn.title = "Delete this point";

    deleteBtn.onclick = () => {
      pointWrapper.remove();
      updateDeleteButtonsVisibility();
    };

    pointWrapper.appendChild(textarea);
    pointWrapper.appendChild(deleteBtn);
    pointsList.appendChild(pointWrapper);

    updateDeleteButtonsVisibility();
  }

  function updateDeleteButtonsVisibility() {
    const allPointsLists = document.querySelectorAll(".points-list");
    allPointsLists.forEach((pointsList) => {
      const wrappers = pointsList.querySelectorAll(".point-wrapper");
      const deleteBtns = pointsList.querySelectorAll(".delete-point-btn");
      if (wrappers.length <= 1) {
        deleteBtns.forEach((btn) => (btn.style.display = "none"));
      } else {
        deleteBtns.forEach((btn) => (btn.style.display = "inline-block"));
      }
    });
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

  localStorage.setItem("progressData", JSON.stringify(data));
  alert("Progress data saved!");
});

document.getElementById("loadBtn").addEventListener("click", () => {
  const saved = localStorage.getItem("progressData");
  if (!saved) {
    alert("No saved data found!");
    return;
  }
  const data = JSON.parse(saved);
  dateInput.value = new Date().toISOString().slice(0, 10); //data.date ||
  headingsContainer.innerHTML = "";
  data.headings.forEach(({ headingName, points }) => {
    headingsContainer.appendChild(createHeadingSection(headingName, points));
  });
  alert("Progress data loaded!");
});

document.getElementById("addHeadingBtn").addEventListener("click", () => {
  headingsContainer.appendChild(createHeadingSection());
});
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}
// Generate WhatsApp text
document.getElementById("generateBtn").addEventListener("click", () => {
  const dateVal = formatDateToDDMMYYYY(dateInput.value) || "N/A";
  let text = `*DAILY PROGRESS*\n*${dateVal}*\n`;

  const sections = headingsContainer.querySelectorAll(".heading-section");
  sections.forEach((section, idx) => {
    const headingInput = section.querySelector(".heading-input");
    const pointsTextareas = section.querySelectorAll(".points-list textarea");

    const headingName = headingInput.value.trim() || "N/A";
    text += `\n*${idx + 1}. ${headingName.toUpperCase()}*\n`;

    pointsTextareas.forEach((ta, pidx) => {
      const val = ta.value.trim() || "N/A";
      text += `   ${pidx + 1}) ${val}\n`;
    });
  });

  document.getElementById("outputText").value = text;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console, log("copy");
      // alert("WhatsApp text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
});

// Load defaults on first load
loadDefaultHeadings();

const defaultHeadingsList = [
  "MLCP",
  "UG SUMP",
  "SOUTH TERMINAL",
  "PARCEL BUILDING",
  "NORTH TERMINAL",
  "TEMPORARY SHIFTING WORK"
];

let headingCount = 0;

// Create a heading section with optional title
function createHeadingSection(title = "") {
  headingCount++;
  const container = document.createElement("div");
  container.className = "heading-section";
  container.dataset.headingId = headingCount;

  // Heading input
  const headingInput = document.createElement("input");
  headingInput.type = "text";
  headingInput.placeholder = "Heading title";
  headingInput.value = title;
  headingInput.className = "heading-input";

  // Remove heading button
  const removeHeadingBtn = document.createElement("button");
  removeHeadingBtn.textContent = "×";
  removeHeadingBtn.className = "remove-btn";
  removeHeadingBtn.title = "Remove Heading";
  removeHeadingBtn.onclick = () => {
    container.remove();
  };

  container.appendChild(headingInput);
  container.appendChild(removeHeadingBtn);

  // Points container
  const pointsList = document.createElement("div");
  pointsList.className = "points-list";

  // Add one empty point by default
  pointsList.appendChild(createPointTextarea());

  container.appendChild(pointsList);

  // Add point button
  const addPointBtn = document.createElement("button");
  addPointBtn.type = "button";
  addPointBtn.textContent = "+ Add Point";
  addPointBtn.onclick = () => {
    pointsList.appendChild(createPointTextarea());
  };

  container.appendChild(addPointBtn);

  return container;
}

function createPointTextarea(value = "") {
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Enter point details";
  textarea.value = value;
  return textarea;
}

// Add new heading with optional title (used when user clicks Add Heading button)
function addHeading(title = "") {
  const container = document.getElementById("headingsContainer");
  container.appendChild(createHeadingSection(title));
}

// Generate WhatsApp text output
function generateWhatsappText() {
  const date = document.getElementById("date").value || "N/A";
  let text = `*DAILY PROGRESS*\n*${date}*\n`;

  const container = document.getElementById("headingsContainer");
  const headingSections = container.querySelectorAll(".heading-section");

  headingSections.forEach((section, idx) => {
    const headingInput = section.querySelector(".heading-input");
    const headingTitle = headingInput.value.trim() || "N/A";
    text += `*${idx + 1}. ${headingTitle}*\n`;

    const points = section.querySelectorAll(".points-list textarea");
    points.forEach((pt, i) => {
      const pointText = pt.value.trim() || "N/A";
      text += `${i + 1}. ${pointText}\n`;
    });
  });

  document.getElementById("outputText").value = text;
}

// Save progress data to localStorage
function saveProgressData() {
  const date = document.getElementById("date").value;
  if (!date) {
    alert("Please select a date before saving.");
    return;
  }

  const container = document.getElementById("headingsContainer");
  const headingSections = container.querySelectorAll(".heading-section");

  const dataToSave = {
    date: date,
    headings: []
  };

  headingSections.forEach((section) => {
    const headingInput = section.querySelector(".heading-input");
    const headingTitle = headingInput.value.trim();

    const points = section.querySelectorAll(".points-list textarea");
    const pointsArr = [];
    points.forEach((pt) => {
      pointsArr.push(pt.value.trim());
    });

    dataToSave.headings.push({
      title: headingTitle,
      points: pointsArr
    });
  });

  localStorage.setItem("dailyProgressData", JSON.stringify(dataToSave));
  alert("Data saved successfully!");
}

// Load data from localStorage
function loadProgressData() {
  const savedData = localStorage.getItem("dailyProgressData");
  if (!savedData) {
    alert("No saved data found.");
    return;
  }

  const data = JSON.parse(savedData);
  document.getElementById("date").value = data.date || "";

  const container = document.getElementById("headingsContainer");
  container.innerHTML = "";
  headingCount = 0;

  if (data.headings && data.headings.length > 0) {
    data.headings.forEach((heading) => {
      const section = createHeadingSection(heading.title);
      const pointsList = section.querySelector(".points-list");
      pointsList.innerHTML = ""; // Remove default empty point

      heading.points.forEach(pointText => {
        pointsList.appendChild(createPointTextarea(pointText));
      });

      container.appendChild(section);
    });
  } else {
    alert("No headings data found in saved data.");
  }
}

// On DOM load - add all default headings empty points
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  document.getElementById("date").value = today.toISOString().split("T")[0];

  const container = document.getElementById("headingsContainer");
  container.innerHTML = "";
  headingCount = 0;

  // Add all default headings on page load
  defaultHeadingsList.forEach(headingTitle => {
    container.appendChild(createHeadingSection(headingTitle));
  });

  // Setup button listeners
  document.getElementById("addHeadingBtn").addEventListener("click", () => addHeading());

  document.getElementById("generateBtn").addEventListener("click", generateWhatsappText);
  document.getElementById("saveBtn").addEventListener("click", saveProgressData);
  document.getElementById("loadBtn").addEventListener("click", loadProgressData);
});

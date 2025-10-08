// =================== TO-DO LIST ===================
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.textContent = taskText;

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("task-buttons");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔";
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);
  });

  btnContainer.appendChild(completeBtn);
  btnContainer.appendChild(deleteBtn);
  li.appendChild(btnContainer);

  taskList.appendChild(li);
  taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// =================== WEATHER APP ===================
const apiKey = "e3af641c03a84ecd4ee8da33ec56b69b";
document.getElementById("getWeather").addEventListener("click", getWeather);
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});


function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherResult = document.getElementById("weatherResult");

  if (city === "") {
    weatherResult.innerHTML = `<p>Please enter a city name.</p>`;
    return;
  }

  // Show loading spinner
  weatherResult.innerHTML = `<div class="spinner"></div>`;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found. Try 'Ondo, NG'");
      return response.json();
    })
    .then(data => {
      const rawCondition = data.weather[0].description.toLowerCase();

      const conditionMap = {
        "clear sky": "☀️ Sunny",
        "few clouds": "🌤️ Partly Cloudy",
        "scattered clouds": "🌥️ Cloudy",
        "broken clouds": "☁️ Cloudy",
        "overcast clouds": "☁️ Cloudy",
        "light rain": "🌦️ Light Rain",
        "moderate rain": "🌧️ Rain",
        "heavy intensity rain": "🌧️ Heavy Rain",
        "thunderstorm": "⛈️ Thunderstorm",
        "snow": "❄️ Snow",
        "mist": "🌫️ Mist"
      };

      const friendlyCondition = conditionMap[rawCondition] || data.weather[0].description;

      const weatherHtml = `
        <h3>${data.name}</h3>
        <p>🌡️ Temp: ${data.main.temp} °C</p>
        <p>${friendlyCondition}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      `;
      weatherResult.innerHTML = weatherHtml;
    })
    .catch(error => {
      weatherResult.innerHTML = `<p>${error.message}</p>`;
    });
}

// =================== BACKGROUND PARTICLES ===================
const canvas = document.getElementById("bg-particles");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
function updatePlannerClock() {
  const clockEl = document.getElementById("planner-clock");
  const now = new Date();

  // Format date
  const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
  const dateStr = now.toLocaleDateString(undefined, options); 
  // Example: "Sat, Sep 14, 2025"

  // Format time
  const timeStr = now.toLocaleTimeString(); // e.g. "10:32:08 AM"

  clockEl.textContent = `${dateStr} • ${timeStr}`;
}

setInterval(updatePlannerClock, 1000);
updatePlannerClock();

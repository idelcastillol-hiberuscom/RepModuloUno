document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;


        let participantsList = '';
        if (details.participants.length > 0) {
          participantsList = details.participants.map(email => `
            <li class="participant-item">
              <span class="participant-email">${email}</span>
              <button class="delete-participant-btn" title="Remove participant" data-activity="${name}" data-email="${email}">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="10" fill="#ffebee"/>
                  <path d="M6 6l8 8M14 6l-8 8" stroke="#c62828" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </li>
          `).join('');
        } else {
          participantsList = '<li class="participant-item"><em>No participants yet</em></li>';
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-section">
            <strong>Participants:</strong>
            <ul class="participants-list">
              ${participantsList}
            </ul>
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
  // Delegate click event for delete buttons
  activitiesList.addEventListener("click", async (event) => {
    const target = event.target.closest(".delete-participant-btn");
    if (target) {
      const activity = target.getAttribute("data-activity");
      const email = target.getAttribute("data-email");
      if (!activity || !email) return;

      // TODO: Implement backend DELETE endpoint. For now, show alert.
      // Uncomment and adjust when backend is ready:
      /*
      try {
        const response = await fetch(`/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`, {
          method: "DELETE"
        });
        if (response.ok) {
          fetchActivities();
        } else {
          const result = await response.json();
          alert(result.detail || "Failed to remove participant.");
        }
      } catch (error) {
        alert("Error removing participant.");
      }
      */
      alert(`(Simulación) Eliminar a ${email} de ${activity}. Implementa el endpoint DELETE en el backend.`);
    }
  });
});

// fetchProjects.js
import fetch from "node-fetch";

const fetchProjects = async () => {
  const url = "http://localhost:3000/api/getProjects"; // Adjust the URL if your app is hosted elsewhere

  const requestBody = {
    query: "",
    filter: {}, // Add your filter criteria here if needed
    sortOrder: "asc", // Or 'desc' based on your requirements
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Projects:", data.projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

fetchProjects();

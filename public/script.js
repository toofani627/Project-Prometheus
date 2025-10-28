document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("hello-btn");
  const responseBox = document.getElementById("api-response");

  button.addEventListener("click", async () => {
    responseBox.textContent = "Loading...";

    try {
      const res = await fetch("/api/hello");

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      responseBox.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      responseBox.textContent = error.message;
    }
  });
});

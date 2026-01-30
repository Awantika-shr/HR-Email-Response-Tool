document.getElementById("emailForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        position: document.getElementById("position").value,
        status: document.querySelector('input[name="status"]:checked').value
    };

    const res = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    document.getElementById("message").innerText = result.message;
});
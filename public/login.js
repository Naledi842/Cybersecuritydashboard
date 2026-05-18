async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginStart", Date.now());

        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerText =
            data.message || "Login failed";
    }
}
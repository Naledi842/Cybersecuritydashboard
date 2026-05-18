const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecretkey";

const db = require("./database");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token"
            });
        }

        req.user = user;
        next();
    });
}

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
    res.send("SecureAuth Lab is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(400).send("User already exists.");
                }
                res.send("User registered successfully.");
            }
        );
    } catch (error) {
        res.status(500).send("Server error.");
    }
});
// Login Route
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@example.com" && password === "admin123") {
        const token = jwt.sign(
            { email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            success: true,
            token
        });
    }

    res.status(400).json({
        success: false,
        message: "Invalid login"
    });
});


app.get("/dashboard", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to the dashboard!",
        user: req.user
    });
});
app.get("/profile", authenticateToken, (req, res) => {
    res.json({
        email: req.user.email,
        message: "Secure profile data accessed",
        loginTime: new Date()
});
});
app.get("/login-history", authenticateToken, (req, res) => {
    db.all(
        "SELECT * FROM login_logs ORDER BY id DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(rows);
        }
    
    );
})
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Нужно уметь парсить JSON-тело
app.use(express.json());

// Если фронтенд запущен на http://localhost:3000, чтобы он мог делать запросы к этому API
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Чтобы читать refresh-токен из cookie
app.use(cookieParser());

// Простой “healthcheck” или “homepage” для проверки
app.get("/", (req, res) => {
    res.json({ message: "Backend is up and running!" });
});

// Здесь позже будут ваши роуты (auth, protected и т.д.)
// Например:
// const authRouter = require("./routes/auth");
// app.use("/auth", authRouter);

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

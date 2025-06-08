// models/userModel.js

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Путь до файла users.json
const DATA_PATH = path.join(__dirname, "users.json");

/**
 * Загружает массив пользователей из файла.
 * Если файла нет или он пуст, возвращает пустой массив.
 * @returns {Promise<Array>}
 */
async function loadUsersFromFile() {
    try {
        const data = await fs.promises.readFile(DATA_PATH, "utf-8");
        return JSON.parse(data); // ожидаем, что там массив объектов
    } catch (err) {
        // Если файл не найден или пуст, возвращаем []
        if (err.code === "ENOENT") {
            return [];
        }
        throw err;
    }
}

/**
 * Сохраняет массив пользователей в файл.
 * @param {Array} users
 * @returns {Promise<void>}
 */
async function saveUsersToFile(users) {
    const data = JSON.stringify(users, null, 2);
    await fs.promises.writeFile(DATA_PATH, data, "utf-8");
}

/**
 * Ищет пользователя по username в файле.
 * @param {string} username
 * @returns {Promise<object|null>}
 */
async function findUserByUsername(username) {
    const users = await loadUsersFromFile();
    const user = users.find((u) => u.username === username);
    return user || null;
}

/**
 * Ищет пользователя по id.
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function findUserById(id) {
    const users = await loadUsersFromFile();
    const user = users.find((u) => u.id === id);
    return user || null;
}

/**
 * Создаёт нового пользователя и записывает в файл.
 * @param {object} param0
 * @param {string} param0.username
 * @param {string} param0.passwordHash
 * @returns {Promise<object>}
 */
async function createUser({ username, passwordHash }) {
    const users = await loadUsersFromFile();
    // Проверка на существующий username
    if (users.some((u) => u.username === username)) {
        throw new Error("Username already taken");
    }
    // Генерируем новый ID (максимальный + 1 или 1, если массив пуст)
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = { id: newId, username, passwordHash };
    users.push(user);
    await saveUsersToFile(users);
    return user;
}

module.exports = {
    findUserByUsername,
    findUserById,
    createUser,
    loadUsersFromFile,  // если нужно будет перечитать всех пользователей
    saveUsersToFile,    // если будем делать update/delete
};

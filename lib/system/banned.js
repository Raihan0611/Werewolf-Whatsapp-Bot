// Middleware to check if user is banned
// Moved from plugins/system/banned-middleware.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNED_PATH = path.join(__dirname, 'banned.json');

function loadBanned() {
    if (!fs.existsSync(BANNED_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(BANNED_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

export default function isBanned(lid) {
    const bannedList = loadBanned();
    return bannedList.includes(lid);
}
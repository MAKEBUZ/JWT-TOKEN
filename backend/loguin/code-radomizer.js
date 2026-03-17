// twofa.js
const crypto = require("crypto");
const fs = require("fs");

const FILE = "./twofa-codes.json";

// cargar almacenamiento local
function loadCodes() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

function saveCodes(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// generar código seguro
function generateCode(userId) {

  // número seguro entre 0000 y 9999
  const code = crypto.randomInt(0, 10000)
    .toString()
    .padStart(4, "0");

  const codes = loadCodes();

  codes[userId] = {
    code,
    expires: Date.now() + 15 * 1000 // 15 segundos de expiración
  };

  saveCodes(codes);

  return code;
}

module.exports = { generateCode };
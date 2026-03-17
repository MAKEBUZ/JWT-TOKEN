const fs = require("fs");
const path = require("path");

// archivo donde se guardan los códigos
const FILE_PATH = path.join(__dirname, "twofa-codes.json");

/**
 * Cargar códigos desde archivo
 */
function loadCodes() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify({}));
    }

    const data = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(data || "{}");

  } catch (error) {
    console.error("Error loading codes:", error);
    return {};
  }
}

/**
 * Guardar códigos en archivo
 */
function saveCodes(codes) {
  try {
    fs.writeFileSync(
      FILE_PATH,
      JSON.stringify(codes, null, 2)
    );
  } catch (error) {
    console.error("Error saving codes:", error);
  }
}

module.exports = {
  loadCodes,
  saveCodes
};
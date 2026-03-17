const { loadCodes, saveCodes } = require("./code-storage");

function verifyCode(userId, inputCode) {

  const codes = loadCodes();
  const record = codes[userId];

  if (!record) return false;

  // expirado //
  if (Date.now() > record.expires) {
    delete codes[userId];
    saveCodes(codes);
    return false;
  }

  const valid = record.code === inputCode;

  // eliminar después de usar (muy importante)
  if (valid) {
    delete codes[userId];
    saveCodes(codes);
  }

  return valid;
}

module.exports.verifyCode = verifyCode;
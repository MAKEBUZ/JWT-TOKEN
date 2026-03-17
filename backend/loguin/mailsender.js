const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const path = require("path");

// cargar variables de entorno correctamente
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const mailerSend = new MailerSend({
  apiKey: process.env.MAILSENDER_KEY,
});

/**
 * Envía el código 2FA al correo del usuario
 * @param {string} email
 * @param {string} code
 */
async function send2FACode(email, code) {
  try {

    const sentFrom = new Sender(
      "MS_dLGzlN@test-ywj2lpnk5vmg7oqz.mlsender.net",
      "Security Service"
    );

    const recipients = [
      new Recipient(email, "Usuario")
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Tu código de verificación 2FA")
      .setHtml(`
        <h2>Autenticación en dos pasos</h2>
        <p>Tu código de acceso es:</p>
        <h1 style="letter-spacing:5px">${code}</h1>
        <p>Este código expira en 5 minutos.</p>
      `)
      .setText(`Tu código 2FA es: ${code}`);

    await mailerSend.email.send(emailParams);

    console.log("✅ Email enviado a:", email);

  } catch (error) {
    console.error("❌ Error enviando email:", error.message);
  }
}

module.exports = { send2FACode };
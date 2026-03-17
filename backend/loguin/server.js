const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});
const { loadCodes, saveCodes } = require("./code-storage");

const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const protegerRuta = require('./authMiddleware');
const  {generateCode} = require ('./code-radomizer');
const { verifyCode } = require('./verify-code.js');
const app = express();
app.use(cors());
app.use(express.json());

const admin_db = { id: 1, email: 'preyas.dylan@gmail.com', password: '123' , rol: 'admin'};
const student_db = { id: 2, email: 'daom3456@gmail.com', password: '123' , rol: 'student'};
//libros para rol student
const libros = [
    { id: 1, titulo: 'El Gran Gatsby', autor: 'F. Scott Fitzgerald' },
    { id: 2, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
    { id: 3, titulo: '1984', autor: 'George Orwell' }
];



//login 2fa
//paso 1
app.post("/login-paso1", (req, res) => {

  const { email, password } = req.body;

  let user = null;

  if (email === admin_db.email && password === admin_db.password) {
    user = admin_db;
  }

  if (email === student_db.email && password === student_db.password) {
    user = student_db;
  }

  if (!user) {
    return res.status(401).json({
      message: "Credenciales inválidas"
    });
  }

  // generar código 2FA

  const code = generateCode(user.id);
  //guardar codigo en code-storage.js
  console.log("2FA CODE:", code);
  const codes = loadCodes();
  codes[user.id] = { code, expires: Date.now() + 5 * 60 * 1000 }; // expira en 5 minutos
  saveCodes(codes);
  //se envia en mailsender
  const { send2FACode } = require("./mailsender");
  send2FACode(user.email, code);
  res.json({
    message: "Código enviado",
    userId: user.id
  });
});

app.get('/protected', protegerRuta, (req, res) => {
    res.json({ message: 'Acceso concedido', user: req.user });
});

//verificar código 2fa devuelve token JWT
app.post("/login-paso2", (req, res) => {
  const { userId, code } = req.body;

  // Aquí deberías verificar el código usando tu función verifyCode
  const valid = verifyCode(userId, code);

  if (!valid) {
    return res.status(401).json({
      message: "Código inválido o expirado"
    });
  }

  // Si el código es válido, generar un token JWT
  const user = userId === admin_db.id ? admin_db : student_db; // Simulación de búsqueda de usuario
  const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    message: "Autenticación exitosa",
    token,
    userrol: user.rol
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
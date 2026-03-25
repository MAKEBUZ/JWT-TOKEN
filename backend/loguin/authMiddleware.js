const jwt =require('jsonwebtoken');
//env not defined


function protegerRuta(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = usuarioDecodificado; // Guardamos la info del usuario en la request
        next();

    });
}

module.exports = protegerRuta;    
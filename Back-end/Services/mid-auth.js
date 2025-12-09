import jwt from 'jsonwebtoken'; 
const mid = (req, res, next) => {
    const noAuth = ['/api/user/login', '/api/user'];
    if (noAuth.includes(req.path) && req.method === 'POST') {
        return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Não autorizado' });
    }
    try {
        jwt.verify(token, process.env.SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

}
export default mid;

const jwt = require('jsonwebtoken');

require('dotenv').config();

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({status:401,message:'Token no proporcionado...'});
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(401).json({status:401,message:'Token invalido...'});
        }

        req.user = user;
        next();
    });

    
}

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.header('Authorization').slice(7);
    console.log(token);
    if(!token){
        return res.status(401).send('Access Denied');
    }
    try{
        const verified = jwt.verify(token, "token_secret");
        req.user = verified;
        next();
    }catch{
        res.status(400).send("Invalid Token");
    }
}
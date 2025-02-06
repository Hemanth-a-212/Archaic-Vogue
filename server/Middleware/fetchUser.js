import jwt from "jsonwebtoken"
import "dotenv/config"

const fetchUser =async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error:"please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user=data.user;
            next();
        } catch (err) {
            res.status(401).send({error:"please authenticate using valid token"})
        }
    }
}

export default fetchUser;
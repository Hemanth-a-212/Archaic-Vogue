import jwt from "jsonwebtoken"
import "dotenv/config"

const fetchUser =async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
        console.error("No token provided");
        return res.status(401).json({error:"No token provided, please authenticate"})
    }
    else{
        try {
            const data = jwt.verify(token,process.env.JWT_SECRET_KEY);
            
            if (!data.user || !data.user.id) {
                console.error("Invalid token structure");
                return res.status(401).json({ error: "Invalid token structure" });
            }
            req.user=data.user;
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).send({error:"please authenticate using valid token"})
        }
    }
}

export default fetchUser;
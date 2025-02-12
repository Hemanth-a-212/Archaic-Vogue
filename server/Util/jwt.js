import jwt from "jsonwebtoken"
import "dotenv/config"

const generateToken = (user) => {
    return jwt.sign({user:{id:user.id}},process.env.JWT_SECRET_KEY)
}

export {generateToken};
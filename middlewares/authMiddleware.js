const jwt= require('jsonwebtoken')
const config = require('../utils/config')

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization

        //iftoken not found
        if (!token) { 
            return res.json({error: 'Token not found'})
        }

        //if token is available, decode the token

        const getTokenFrom = (req) => {
            const authorization = req.headers.authorization
            if (authorization && authorization.toLowerCase().startsWith('bearer '))
                return authorization.substring(7)

            return null
        }

        try {
            jwt.verify(getTokenFrom(req), config.JWT_SECRET, (error, decodedToken) => {
                if (error)
                    return res.json({ error: error.message })
                req.userId = decodedToken.id
                next()
            })
        }
        catch (error) {
            res.status(500).json({ error: error.message})
        }
    }
}

module.exports = authMiddleware
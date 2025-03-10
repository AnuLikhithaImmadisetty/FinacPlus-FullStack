class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

const errorMiddleware = (err, req, res, next) => {
    
    return res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}

module.exports = {ErrorHandler, errorMiddleware}
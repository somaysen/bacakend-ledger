class AppError extends Error {
    constructor(messages, statusCode, error = null){
        super(messages),
        this.statusCode = statusCode,
        this.error = error
    }
}

export {AppError};
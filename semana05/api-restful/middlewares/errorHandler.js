const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Para ver el error en la consola
    const status = err.status || 500;
    const message = err.message || "Error interno del servidor";
    
    res.status(status).json({
        error: true,
        status: status,
        message: message
    });
};

module.exports = errorHandler;
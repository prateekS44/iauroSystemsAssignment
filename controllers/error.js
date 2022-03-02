exports.get404 = (req, res, next) => {
    res.json({
        message: "Not Found"
    })
};

exports.errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal server error";
    const responseJson = {};
    responseJson.message = message;
    if(err.error) responseJson.error = err.error;
    res.status(status).json(responseJson);
}
  
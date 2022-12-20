module.exports = (err, req, res, next) => {
  console.log(err);
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    detail: err.detail,
  });
};

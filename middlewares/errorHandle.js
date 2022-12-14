const notFound = (req, res, next) => {
  const error = new Error(`NOT FOUND - ${req.originalUrl} `);
  res.status(404);
  next(error);
};
const errorHandle = (err, req, res, next) => {
  const statusCode = res.stattusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandle, notFound };

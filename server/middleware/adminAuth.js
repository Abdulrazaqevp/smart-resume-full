export const adminAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or missing API key"
    });
  }

  next();
};

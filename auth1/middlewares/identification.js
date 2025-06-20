const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  let token;

  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized: Token not provided" });
  }

  try {
    const userToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    if (!userToken || userToken.trim() === "") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized: Token is empty" });
    }

    const jwtVerified = jwt.verify(userToken, process.env.SECRET_KEY);

    req.user = jwtVerified;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

import { invalidResponse } from "../../../utils/responses/responseHandler.js";
import { verifyToken } from "../../../utils/tokenService/index.js";
import { Users } from "../../models/index.js";

export async function checkAuth(req, res, next) {
  if (req.excludedPath) return next();
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .send(invalidResponse('Authorizations was not provided', null));
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .send(invalidResponse('Token was not provided', null));
  }
  try {
    const { _, payload } = await verifyToken(token);
    const { id, email,role, fullName } = payload;

    req.user = {
      id,
      email,
      role
    };

    const user = await Users.findById(id);
    if (!user)
      return res
        .status(401)
        .json(invalidResponse('Invalid user! Login again!', null));
    next();
  } catch (error) {
    return res.status(401).json(invalidResponse('Not Authorized!', null));
  }
}
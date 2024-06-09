import { isValidObjectId } from "mongoose";

export function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Invalid id of  : ", req.params.id);
  }
  next();
}

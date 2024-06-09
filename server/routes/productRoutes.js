import express from "express";
import formidable from "express-formidable";
import { authentication, authorizeAdmin } from "../utils/protectRoute.js";
import { checkId } from "../utils/checkId.js";
import {
  addProduct,
  addProductReview,
  deleteProduct,
  getAllProduct,
  getNewProducts,
  getProductById,
  getProducts,
  getTopProducts,
  updateDetailsProduct,
} from "../controllers/productControllers.js";

const router = express.Router();
router
  .route("/")
  .get(getProducts)
  .post(authentication, authorizeAdmin, formidable(), addProduct);
router.get("/allproducts", getAllProduct);
router.post(
  "/:id/reviews",
  authentication,
  authorizeAdmin,
  checkId,
  addProductReview
);
router.get("/topproducts", getTopProducts);
router.get("/newproducts", getNewProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(authentication, authorizeAdmin, formidable(), updateDetailsProduct)
  .delete(authentication, authorizeAdmin, deleteProduct);
export default router;

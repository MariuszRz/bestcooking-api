const express = require("express");
const router = new express.Router();
const UserController = require("../controllers/user-controller");
const isAuthApiMiddleware = require("../middleware/is-auth-api-middleware");
const isAdmin = require("../middleware/is-admin-middleware");
// Admin

// UŻYTKOWNIK
router.post("/login", UserController.login);
router.post("/logout", isAuthApiMiddleware, UserController.logout);
router.post("/register", UserController.register);
router.post("/refreshtoken", UserController.refresh);
router.put("/:id/edit", isAuthApiMiddleware, UserController.edit);
router.put("/:id/password", isAuthApiMiddleware, UserController.changePassword);
router.delete("/:id", isAuthApiMiddleware, isAdmin, UserController.delete);
router.post("/get-all", isAuthApiMiddleware, isAdmin, UserController.getAll);

module.exports = router;

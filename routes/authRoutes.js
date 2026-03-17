const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { checkUsernameAvailability } = require("../controllers/authController");

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: User login
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Login Successful
 */

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/check-username/:username", checkUsernameAvailability);

module.exports = router;

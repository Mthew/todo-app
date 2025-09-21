import { Router } from "express";
import { TagController } from "../controllers/tag.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";
import { CreateTagSchema } from "../../application/dtos/tag.dto";

const tagRouter = Router();
const tagController = new TagController();

// All tag routes are protected and rate limited
tagRouter.use(rateLimitMiddleware.crud);
tagRouter.use(protect);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     description: Create a new tag for the authenticated user
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagRequest'
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Validation error or tag already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get user tags
 *     description: Retrieve all tags for the authenticated user
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagsResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
tagRouter
  .route("/")
  .post(validate(CreateTagSchema), tagController.create)
  .get(tagController.getByUser);

export { tagRouter };

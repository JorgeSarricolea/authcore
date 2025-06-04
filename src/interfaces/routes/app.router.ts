import { asyncHandler } from "@/interfaces/middlewares/async-handler.middleware";
import { Router } from "express";

const router = Router();

const ENDPOINT = "/app";

router.get(
  `${ENDPOINT}/health-check`,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  })
);

export default router;

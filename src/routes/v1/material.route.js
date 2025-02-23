const express = require("express");
const materialController = require("../../controllers/material.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(auth(), materialController.createMaterials) // Create Material
  .get(auth(), materialController.getAllMaterialss); // Get All Materials

router
  .route("/:materialId")
  .get(auth(), materialController.getMaterialByIds) // Get Material by ID
  .patch(auth(), materialController.updateMaterialByIds) // Update Material by ID
  .delete(auth(), materialController.deleteMaterialByIds); // Delete Material by ID

module.exports = router;

const express = require("express");
const router = express.Router();
const studyMaterialController = require("../controllers/studyMaterialController");

router.get("/study-material", studyMaterialController.getStudyMaterials);

module.exports = router;

const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/pharmacyController");

const {
    protect,
    isManager,
    isStaff,
    isAccountActive,
} = require("../middleware/auth");

router.post("/add-info", protect, isManager, isAccountActive, pharmacyController.addInfo);
router.get("/", protect, isAccountActive, pharmacyController.getInfo);
router.put("/update-info", protect, isAccountActive, isManager, pharmacyController.updateInfo);


module.exports = router;
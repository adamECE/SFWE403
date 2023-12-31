const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { ROLES } = require("../config/pharmacy0x2Const");
const Inventory = require("../models/inventory");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
//const PrescritpionLog = require("../models/activityLog");
const {
  PrescriptionLog,
  InventoryUpdateLog,
} = require("../models/activityLog");

exports.addPrescription = asyncHandler(async (req, res) => {
  try {
    // Extract item details from the request body
    const {
      userID,
      doctorName,
      medicationID,
      quantity,
      dosage,
      deliveredBy,
      refillPolicy,
    } = req.body;

    //check if all the required inputs are given
    if (
      !userID ||
      !doctorName ||
      !medicationID ||
      !quantity ||
      !dosage ||
      !deliveredBy ||
      !refillPolicy
    ) {
      res.status(400).json({ error: "Please add all Fields" });
      return;
    }

    const userData = await User.findById(userID);

    if (!userData) {
      // If the userId is not found in the Inventory
      res.status(404).json({ error: "User not found in database" });
      return;
    } else {
      if (userData.role != ROLES.PATIENT) {
        //check if user is not a patient
        res.status(401).json({ error: "User is not a patient" });
        return;
      }
      const inventoryItem = await Inventory.findById(medicationID);
      if (!inventoryItem) {
        //check if medication is available
        res.status(404).json({ error: "Medication not found in inventory" });
        return;
      }

      if (inventoryItem.category != "prescription") {
        //check if medication requires precription
        res
          .status(401)
          .json({ error: "Medication does not require prescription" });
        return;
      }

      const newPerscription = {
        doctorName,
        medicationID,
        quantity,
        dosage,
        deliveredBy,
        refillPolicy,
      };

      userData.prescriptions.push(newPerscription);
      await userData.save();

      res.status(200).json({ message: "new perscription item added" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getPrescriptionLogs = asyncHandler(async (req, res) => {
  try {
    const prescriptionLogs = await PrescriptionLog.find();

    // Format the date and time for each log entry
    const formattedLogs = prescriptionLogs.map((log) => ({
      pharmacistEmail: log.pharmacistEmail,
      pharmacistName: log.pharmacistName,
      prescriptionID: log.prescriptionID,
      patientName: log.patientName,
      patientEmail: log.patientEmail,
      itemType: log.itemType,
      quantity: log.quantity,
      date: new Date(log.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: new Date(log.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));

    res.json(formattedLogs);
  } catch {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getPrescription = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      // If the userId is not found in the Inventory
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const userInfo = await User.findById(userId).populate({
      path: "prescriptions",
      populate: {
        path: "medicationID",
        model: "Inventory",
        select: "_id name description manufacturer price location",
      },
    });

    if (!userInfo) {
      res.status(404).json({ error: "User not found in database" });
      return;
    }
    // renaming medicationID field into medicationInfo

    const prescriptionsWithMedicationInfo = userInfo.prescriptions.map(
      (prescription) => {
        prescription = prescription.toObject();
        prescription["medicationInfo"] = prescription.medicationID;
        delete prescription.medicationID;
        return prescription;
      }
    );

    res.status(200).json({
      userInfo: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
      },
      prescription: prescriptionsWithMedicationInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getPrescriptionByEmail = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      // If the userId is not found in the Inventory
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const userInfo = await User.findOne({ email }).populate({
      path: "prescriptions",
      populate: {
        path: "medicationID",
        model: "Inventory",
        select: "name description manufacturer price location",
      },
    });

    if (!userInfo) {
      res.status(404).json({ error: "User not found in database" });
      return;
    }
    // renaming medicationID field into medicationInfo

    const prescriptionsWithMedicationInfo = userInfo.prescriptions.map(
      (prescription) => {
        prescription = prescription.toObject();
        prescription["medicationInfo"] = prescription.medicationID;
        delete prescription.medicationID;
        return prescription;
      }
    );

    res.status(200).json({
      userInfo: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        _id: userInfo._id,
      },
      prescription: prescriptionsWithMedicationInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getPrescriptionToProcess = asyncHandler(async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      // If the userId is not found in the Inventory
      res.status(400).json({ error: "userId is required" });
      return;
    }
    const userInfo = await User.findOne({ email }).populate({
      path: "prescriptions",
      populate: {
        path: "medicationID",
        model: "Inventory",
        select: "_id name description manufacturer price location",
      },
    });

    if (!userInfo) {
      res.status(404).json({ error: "User not found in database" });
      return;
    }

    let prescriptionsTopickUP = [];
    for (let i = 0; i < userInfo.prescriptions.length; i++) {
      let newfilledInfo = [];
      if (userInfo.prescriptions[i].filledInfo.length > 0) {
        for (let j = 0; j < userInfo.prescriptions[i].filledInfo.length; j++) {
          if (
            userInfo.prescriptions[i].filledInfo[j].pickedUpInfo.status == false
          )
            newfilledInfo.push(userInfo.prescriptions[i].filledInfo[j]);
        }
        if (newfilledInfo.length > 0) {
          userInfo.prescriptions[i].filledInfo = newfilledInfo;
          prescriptionsTopickUP.push(userInfo.prescriptions[i]);
        }
      }
    }

    const prescriptionsWithMedicationInfo = prescriptionsTopickUP.map(
      (prescription) => {
        prescription = prescription.toObject();
        prescription["medicationInfo"] = prescription.medicationID;
        delete prescription.medicationID;
        return prescription;
      }
    );

    res.status(200).json({
      userInfo: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
      },
      prescription: prescriptionsWithMedicationInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

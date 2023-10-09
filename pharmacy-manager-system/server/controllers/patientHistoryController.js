const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { ROLES } = require("../config/pharmacy0x2Const");
const Inventory = require("../models/inventory");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });


exports.addPerscription = asyncHandler(async(req, res) => {
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
        if (!userID ||
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
            res.status(404).json({ error: 'User not found in database' });
            return
        } else {

            if (userData.role != ROLES.PATIENT) { //check if user is not a patient
                res.status(401).json({ error: 'User is not a patient' });
                return
            }
            const inventoryItem = await Inventory.findById(medicationID);
            if (!inventoryItem) { //check if medication is available
                res.status(404).json({ error: 'Medication not found in inventory' });
                return
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
            await userData.save()

            // Return the newly created item as the response
            res.status(200).json({ message: "new perscription item added" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});
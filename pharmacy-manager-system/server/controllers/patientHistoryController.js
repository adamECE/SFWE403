const asyncHandler = require("express-async-handler");
const prescriptionSchema = require("../models/prescription")
const User = require("../models/user");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });

exports.addPerscription = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const {
            userId, 
            doctorName,
            medicationName,
            dosage,
            deliveredBy,
            refillPolicy,
            filledDate,
            isValid,
        } = req.body;


        //check if all the required inputs are given
        if (!userId ||
            !doctorName ||
            !medicationName ||
            !dosage ||
            !deliveredBy || 
            !refillPolicy ||
            !filledDate || !isValid
        ) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }

       const userData = await User.findById(userId);

        if (!userData) {
            // If the userId is not found in the Inventory
            res.status(404).json({ error: 'User not found in database' });
            return
        } else {
            // Create a new Inventory item
            const newPerscription = new prescriptionSchema({
                doctorName,
                medicationName,
                dosage,
                deliveredBy,
                refillPolicy,
                filledDate,
                isValid,
            });

            // not sure if we need this: 
            //await newPerscription.save();

            userData.prescriptions.push(newPerscription);
            await userData.save()

            // Return the newly created item as the response
            res.status(201).json("new perscription item added");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});
const asyncHandler = require("express-async-handler");
const Pharmacy = require("../models/pharmacy");
const { ORDER_STATUS } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });



//add the pharmacy info
exports.addInfo = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const { name, website, address, owner, phoneNumber, workingHours } = req.body;

        //check if all the required inputs are given
        if (!name || !website || !address || !owner || !phoneNumber || !workingHours) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }

        const pharmacyInfo = await Pharmacy.find();
        if (!pharmacyInfo) {
            res.status(400).json({ error: 'Pharmacy Info has been added already! Please choose option to update instead' });
            return
        }
        const newPharmacyInfo = new Pharmacy({
            name,
            website,
            address,
            owner,
            phoneNumber,
            workingHours
        });

        await newPharmacyInfo.save();
        res.status(201).json("Pharmacy info added!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});

//return order list
exports.getInfo = asyncHandler(async(req, res) => {
    try {

        const pharmacyInfo = await Pharmacy.find()

        res.status(200).json(pharmacyInfo);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});

//update pharmacy information
exports.updateInfo = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const { _id, name, website, address, owner, phoneNumber, workingHours } = req.body;
        console.log(req.body)
            //check if all the required inputs are given
        if (!_id || !name || !website || !address || !owner || !phoneNumber || !workingHours) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }


        const pharmacyInfo = await Pharmacy.findById(_id);
        if (!pharmacyInfo) {
            // If the orderID is not found in the Inventory
            res.status(404).json({ error: 'Pharmacy Info not found in db' });
            return
        }
        pharmacyInfo.name = name || pharmacyInfo.name
        pharmacyInfo.owner = owner || pharmacyInfo.owner
        pharmacyInfo.website = website || pharmacyInfo.website
        pharmacyInfo.address = address || pharmacyInfo.address
        pharmacyInfo.phoneNumber = phoneNumber || pharmacyInfo.phoneNumber
        pharmacyInfo.workingHours = workingHours || pharmacyInfo.workingHours


        await pharmacyInfo.save()
        res.status(200).json({ message: "Your Pharmacy info has been updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});
const express = require('express');
exports.ROLES = {
    'PATIENT': "patient",
    'PHARMACY_MANAGER': "pharmacy manager",
    'PHARMACIST': "pharmacist",
    'PHARMACY_TECHNICIAN': "pharmacy technician",
    'CASHIER': "cashier"

};

exports.ORDER_STATUS = {
    'PLACED': "placed",
    'INPROGRESS': "in progress",
    'CANCELLED': "cancelled",
    'RECEIVED': "received"


};
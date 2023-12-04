const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { generateApiKey } = require("generate-api-key");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const {
  PrescriptionLog,
  InventoryUpdateLog,
  AuthLog,
} = require("../models/activityLog");

//create and save new staff
exports.createStaff = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    role,
    phoneNumber,
    address,
  } = req.body;
  const password = generateApiKey({
    method: "string",
    length: 10,
  });

  //check if all the required inputs are given
  if (
    !firstName ||
    !lastName ||
    !email ||
    !dateOfBirth ||
    !role ||
    !phoneNumber ||
    !address
  ) {
    res.status(400).json({ error: "Please add all Fields" });
    //throw new Error('Please add all Fields')
  } else {
    if (
      Object.values(ROLES).includes(role.toLowerCase()) &&
      role != ROLES.PATIENT
    ) {
      //look for user and device in the db
      const findUser = await User.findOne({ email });

      //if user already on db... trow an error
      if (findUser) {
        res.status(400).json({ error: "User Already exist" });
      } else {
        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new User({
          //cretaes a new staff obj
          firstName: firstName,
          lastName: lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          dateOfBirth: dateOfBirth,
          role: role.toLowerCase(),
          phoneNumber: phoneNumber,
          address: address,
        });
        newStaff.save().then((savedDoc) => {
          if (savedDoc == newStaff) {
            res.status(200).json({ message: `user password is ${password}` });
          } else {
            res.status(400).json({ error: "bad" });
          }
        });
      }
    } else {
      res.status(400).json({ error: "Incorrect Staff role" });
    }
  }
});

//create and save new patient
exports.createPatient = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    phoneNumber,
    insuranceInformation,
    address,
  } = req.body;
  const password = generateApiKey({
    method: "string",
    length: 10,
  });

  //check if all the required inputs are given
  if (
    !firstName ||
    !lastName ||
    !email ||
    !dateOfBirth ||
    !phoneNumber ||
    !insuranceInformation ||
    !address
  ) {
    res.status(400).json({ error: "Please add all Fields" });
    //throw new Error('Please add all Fields')
  } else {
    //look for user and device in the db
    const findUser = await User.findOne({ email });

    //if user already on db... trow an error
    if (findUser) {
      res.status(400).json({ error: "User Already exist" });
      //throw new Error('User Already exist')
    } else {
      //hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newPatient = new User({
        //creates a new patient obj
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        dateOfBirth: dateOfBirth,
        role: ROLES.PATIENT,
        phoneNumber: phoneNumber,
        insuranceInformation: insuranceInformation,
        address: address,
      });
      newPatient
        .save()
        .then((savedDoc) => {
          if (savedDoc == newPatient) {
            res
              .status(200)
              .json({ message: `patient account created sucessfully!` });
          } else {
            res.status(400).json({ error: "bad" });
          }
        })
        .catch((error) => {
          res.status(500).json({ error: "OOOPs something went wrong!" });
        });
    }
  }
});

exports.updatePatient = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    phoneNumber,
    insuranceInformation,
    address,
  } = req.body;
  console.log(req.body);
  try {
    //look for user and device in the db
    const findUser = await User.findOne({ email });

    //if user already on db... trow an error
    if (!findUser) {
      res.status(404).json({ error: "User not found" });
      return;
      //throw new Error('User Already exist')
    } else {
      findUser.firstName = firstName || findUser.firstName;
      findUser.lastName = lastName || findUser.lastName;
      findUser.dateOfBirth = dateOfBirth || findUser.dateOfBirth;
      findUser.phoneNumber = phoneNumber || findUser.phoneNumber;
      findUser.insuranceInformation =
        insuranceInformation || findUser.insuranceInformation;
      findUser.address = address || findUser.address;

      findUser.save();
      res.status(200).json({ message: `patient account updated sucessfully!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "OOOPs something went wrong!" });
  }
});

//remove patient account
exports.removePatient = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (
    req.user.role != ROLES.PHARMACY_MANAGER &&
    req.user.role != ROLES.PHARMACIST
  ) {
    res.status(401).json({
      error:
        "Not authorized: action can only be performed by pharmacy manager or  Pharmacist",
    });
    return;
  }
  // try to find the user for the given user email
  const user = await User.findOne({ email });

  if (user) {
    //check if the user with account locked is a staff member
    if (
      Object.values(ROLES).includes(user.role.toLowerCase()) &&
      user.role == ROLES.PATIENT
    ) {
      await User.deleteOne({ email });
      res.status(200).json({ message: `patient account has been deleted` });
    } else
      res.status(401).json({ error: "Not authorized: user is not a patient!" });
  } else res.status(404).json({ error: "User not found!" });
});

//staff login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // get the given user name and password

  // try to find the user for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    //if the user was found and the given password match the saved hash
    //check if account is locked
    if (user.isLocked) {
      res
        .status(400)
        .json({ error: "Your account is locked! Please contact your manager" });
      return;
    } else {
      user.lastLogin = new Date();
      user.loginAttempts = 0; //reset the login attempts counter
      await user.save();
      const log_Auth = new AuthLog({
        staffEmail: user.email,
        staffName: `${user.firstName} ${user.lastName}`,
        actionType: "login",
      });
      log_Auth.save();
      res.status(200).json({
        email: user.email,
        token: await generateToken(user.email), //generates a token for the user session
        role: user.role,
        isACCountActive: user.isActive,
      }); //returns the user email,role, account status, and the auth token
    }
  } else {
    let message = "Invalid credentials! ";
    //if the user password is incorrect
    if (user && !(await bcrypt.compare(password, user.password))) {
      user.loginAttempts++; //record the incorrect login attemt
      if (user.loginAttempts >= 5) {
        //if more than 5 incorrect login attempts were recorded
        user.isLocked = true; //lock the account
        message = message + " Your Account has been Locked";
      }

      await user.save(); //update user information
    }
    res.status(400).json({ error: message });
  }
});

//staff login
exports.logout = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const log_Auth = new AuthLog({
      staffEmail: user.email,
      staffName: `${user.firstName} ${user.lastName}`,
      actionType: "logout",
    });
    log_Auth.save();
    console.log("out");
    res.status(200).json({ message: "you are logged out" });
  } catch (error) {
    throw ("Error sending email notification:", error);
  }
});

//staff account activation on 1st password reset
exports.firstPasswordReset = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (newPassword != confirmPassword) {
    res.status(400).json({ error: "New Password dont match!" });
    return;
  }

  // try to find the user for user email
  const user = await User.findOne({ email: req.user.email });

  if (user && (await bcrypt.compare(currentPassword, user.password))) {
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.isActive = true;

    await user
      .save()
      .then((updatedDoc) => {
        if (updatedDoc == user) {
          req.user.isActive = true;
          res.status(200).json({
            message: " Password has been reset and your account was activated!",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: "OOOPs something went wrong!" });
      });
  } else res.status(400).json({ error: "Incorrect Current Password" });
});

//staff account unlock
exports.unlockAccount = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // try to find the user for the given user email
  const user = await User.findOne({ email });

  if (user) {
    //check if the user with account locked is a staff member
    if (
      Object.values(ROLES).includes(user.role.toLowerCase()) &&
      user.role != ROLES.PATIENT
    ) {
      user.isLocked = false; //unlock the account
      user.loginAttempts = 0; //reset the login attempts

      await user
        .save()
        .then((updatedDoc) => {
          if (updatedDoc == user)
            res
              .status(200)
              .json({ message: `user account unlocked sucessfully!` });
        })
        .catch((error) => {
          res.status(500).json({ error: "OOOPs something went wrong!" });
        });
    } else
      res
        .status(401)
        .json({ error: "Not authorized: user is not a staff member!" });
  } else res.status(404).json({ error: "User not found!" });
});

//send password reset email link
exports.sendPasswordResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // try to find the user for the given user email
  const user = await User.findOne({ email });

  if (user) {
    //check if the user with account locked is a staff member
    if (
      Object.values(ROLES).includes(user.role.toLowerCase()) &&
      user.role != ROLES.PATIENT
    ) {
      if (!user.isActive) {
        res.status(400).json({
          error:
            "Your account has not been Activated yet! Please contact your manager",
        });
        return;
      }

      if (user.isLocked) {
        res.status(400).json({
          error: "Your account is locked! Please contact your manager",
        });
        return;
      }

      // Generate a JSON Web Token (JWT) containing the user's email
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const mailOptions = {
        from: "pharmacy.x02@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `
          <p>You have requested a password reset for your account.</p>
          <p>Click the following link to reset your password:</p>
          <a href="http://localhost:3000/reset-password?token=${token}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully.");
        res
          .status(200)
          .json({ message: `Password reset email sent to ${email}` });
      } catch (error) {
        throw ("Error sending email notification:", error);
      }
    } else
      res
        .status(401)
        .json({ error: "Not authorized: user is not a staff member!" });
  } else res.status(404).json({ error: "User not found!" });
});

//send password reset email link
exports.sendTwoFactorEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // try to find the user for the given user email
  const user = await User.findOne({ email });

  if (user) {
    //check if the user with account locked is a staff member
    if (
      Object.values(ROLES).includes(user.role.toLowerCase()) &&
      user.role != ROLES.PATIENT
    ) {
      // if (!user.isActive) {
      //     res.status(400).json({ error: "Your account has not been Activated yet! Please contact your manager" })
      //     return
      // }

      if (user.isLocked) {
        res.status(400).json({
          error: "Your account is locked! Please contact your manager",
        });
        return;
      }

      // Generate a 6 digit code
      code = Math.floor(100000 + Math.random() * 900000);
      user.twoFactorCode = code;
      await user.save();
      const mailOptions = {
        from: "pharmacy.x02@gmail.com",
        to: email,
        subject: "2-Factor Code Pharmacy X02",
        html: `
          <p>Here's your 2-factor authentication code.</p>
          <p>${code}</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("2 factor sent successfully.");
        res.status(200).json({ code: code });
      } catch (error) {
        throw ("Error sending email notification:", error);
      }
    } else
      res
        .status(401)
        .json({ error: "Not authorized: user is not a staff member!" });
  } else res.status(404).json({ error: "User not found!" });
});

exports.checkTwoFactorCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  // try to find the user for the given user email
  const user = await User.findOne({ email });

  if (user) {
    //check if the user with account locked is a staff member
    if (
      Object.values(ROLES).includes(user.role.toLowerCase()) &&
      user.role != ROLES.PATIENT
    ) {
      //   if (!user.isActive) {
      //     res
      //       .status(400)
      //       .json({
      //         error:
      //           "Your account has not been Activated yet! Please contact your manager",
      //       });
      //     return;
      //   }

      if (user.isLocked) {
        res.status(400).json({
          error: "Your account is locked! Please contact your manager",
        });
        return;
      }

      if (user.twoFactorCode != Number(code)) {
        res.status(400).json({ error: "Incorrect verification code" });
        return;
      } else {
        user.twoFactorCode = null;
        user.save();
        res.status(200).json({ message: "verified" });
      }
    } else
      res
        .status(401)
        .json({ error: "Not authorized: user is not a staff member!" });
  } else res.status(404).json({ error: "User not found!" });
});

//send password reset email link
exports.passwordReset = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  // try to find the user for the given user email
  const email = jwt.verify(token, process.env.JWT_SECRET).email;
  console.log(email);
  const user = await User.findOne({ email });

  if (user) {
    //check if the user is a staff member
    if (
      Object.values(ROLES).includes(user.role.toLowerCase()) &&
      user.role != ROLES.PATIENT
    ) {
      if (newPassword != confirmPassword) {
        res.status(400).json({ error: "New Password dont match!" });
        return;
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user
          .save()
          .then((updatedDoc) => {
            if (updatedDoc == user) {
              res.status(200).json({
                message: " Your password has been reset!",
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: "OOOPs something went wrong!" });
          });
      }
    } else
      res
        .status(401)
        .json({ error: "Not authorized: user is not a staff member!" });
  } else res.status(404).json({ error: "User not found!" });
});

exports.getPatientList = asyncHandler(async (req, res) => {
  const filter = { role: "patient" };

  const userList = await User.find(filter).select(
    "-password -isLocked -loginAttempts -lastLogin -isActive -prescriptions"
  );
  if (!userList) {
    res.status(404).json({ message: "No Patients found" });
  } else {
    res.status(200).json(userList);
  }
});

exports.getStaffList = asyncHandler(async (req, res) => {
  const filter = { role: { $ne: "patient" } };

  const staffList = await User.find(filter).select(
    "-password -prescriptions -insuranceInformation "
  );
  if (!staffList) {
    res.status(404).json({ message: "No staff found" });
  } else {
    res.status(200).json(staffList);
  }
});

exports.getStaffMember = asyncHandler(async (req, res) => {
  const filter = req.params;

  const staffList = await User.findOne(filter).select(
    "-password -prescriptions -insuranceInformation "
  );
  if (!staffList) {
    res.status(404).json({ message: "No staff found" });
  } else {
    res.status(200).json(staffList);
  }
});

exports.getAPatient = asyncHandler(async (req, res) => {
  const filter = { email: req.params.email, role: "patient" };
  const patientInfo = await User.findOne(filter).select(
    "-password  -isLocked -loginAttempts -lastLogin -isActive -prescriptions"
  );
  if (!patientInfo) {
    res.status(404).json({ error: "No Patient found! Add Patient Account" });
  } else {
    res.status(200).json(patientInfo);
  }
});

exports.getAuthLogs = asyncHandler(async (req, res) => {
  try {
    const logs = await AuthLog.find();

    // Format the date and time for each log entry
    const formattedLogs = logs.map((log) => ({
      staffEmail: log.staffEmail,
      staffName: log.staffName,
      actionType: log.actionType,
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

//this function uses jwt to generate the user auth token given the email
const generateToken = async (email) => {
  return jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

// Configure Nodemailer with email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "pharmacy.x02@gmail.com",
    pass: "dlmi ndpe xoru bflk",
  },
  tls: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },
});

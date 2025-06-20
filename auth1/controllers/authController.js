const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, acceptFPCodeSchema} = require("../middlewares/validator");
const User = require("../models/usersModel.js")
const {doHash, doHashValidation, hmacProcess} = require("../utils/hashing.js")
const transporter = require("../middlewares/sendMail.js");



exports.signup = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const {error, value} = signupSchema.validate(req.body);
        if(error){
            return res.status(401).json({success: false, message: error.details[0].message});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({success: false , message: "Email already exists"});
        }
        const hashedPassword  = await doHash(password, 12);

        const newUser = new User({
            email, 
            password: hashedPassword,
        })
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success: true, message: "User created successfully", data: result
        })
    } catch(err){
        console.log(err);
    }

};



exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password0" });
    }
    
    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password1" });
    }
    
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.SECRET_KEY,{
        expiresIn: "8h"
      }
    );

    existingUser.password = undefined;

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "Logged in successfully",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};



exports.signout = async(req, res)=>{
    res.clearCookie('Authorization').status(200).json({success: true, message: 'logged out successfully'})
}



exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();

    const info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification Code",
      html: `<h1>${codeValue}</h1>`,
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({ success: true, message: "Code sent!" });
    }

    return res
      .status(200)
      .json({ success: false, message: "Code sending failed" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



exports.verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body;
  try {
    const { error, value } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log(existingUser);
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "You are already verified" });
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is invalid1" });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is expired" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    console.log(hashedCodeValue);
    if (hashedCodeValue === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Verification successful" });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid verification code" });
  } catch (err) {
    console.error(err);
  }
};



exports.changePassword = async (req, res) => {
  const { userId, verified } = req.user;
  const {oldPassword, newPassword} = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({oldPassword, newPassword});
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    console.log(req.user);
    if (!verified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your account first" });
    }

    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );
    console.log(existingUser);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const result = await doHashValidation(oldPassword, existingUser.password);
    if (!result) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid old password" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be different from old password",
        });
    }

    existingUser.password = await doHash(newPassword, 12);
    await existingUser.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


exports.sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();

    const info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Forgot Password Code",
      html: `<h1>${codeValue}</h1>`,
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.forgotPasswordCode = hashedCodeValue;
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({ success: true, message: "Code sent!" });
    }

    return res
      .status(200)
      .json({ success: false, message: "Code sending failed" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.verifyForgotPasswordCode = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error, value } = acceptFPCodeSchema.validate({ email, providedCode, newPassword });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is invalid1" });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is expired" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    console.log(hashedCodeValue);
    if (hashedCodeValue === existingUser.forgotPasswordCode) {
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Verification successful" });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid verification code" });
  } catch (err) {
    console.error(err);
  }
};
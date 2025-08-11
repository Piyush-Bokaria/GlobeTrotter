import User from "../models/User.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Register request received:', { name, email, password: '***' });
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await newUser.save();

    try {
      await sendVerificationEmail(email, otp);
      res
        .status(201)
        .json({
          message: "User registered successfully. OTP sent to your email.",
        });
    } catch (emailError) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(newUser._id);
      console.error('Email sending failed, user deleted:', emailError);
      return res
        .status(500)
        .json({ 
          message: "Failed to send verification email. Please try again.", 
          error: emailError.message 
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login request received:', { email, password: '***' });
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // OTP is valid, mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

const sendVerificationEmail = async (email, otp) => {
  try {
    console.log('Attempting to send email to:', email);
    console.log('Using OAuth2 credentials for:', process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('Transporter verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "GlobeTrotter: OTP Verification",
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #4CAF50;">Welcome to GlobeTrotter!</h1>
                  <p>Thank you for registering with us. To complete your registration, please verify your email address.</p>
                  <p>Your one-time password (OTP) is:</p>
                  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                      <h2 style="color: #4CAF50; font-size: 32px; margin: 0;">${otp}</h2>
                  </div>
                  <p>This code is valid for 10 minutes only.</p>
                  <p>If you didn't request this verification, please ignore this email.</p>
                  <hr style="margin: 30px 0;">
                  <p style="color: #666; font-size: 12px;">This is an automated message from GlobeTrotter. Please do not reply to this email.</p>
              </div>
          `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export { register, login, verifyOTP, getAllUsers };

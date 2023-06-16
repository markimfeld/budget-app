import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sebastianimfeld@gmail.com",
    pass: "wcxtcuuaorxukspd",
  },
});

export default transporter;

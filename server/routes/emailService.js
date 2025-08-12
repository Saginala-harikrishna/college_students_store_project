// emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use SMTP if you don't want Gmail
  auth: {
    user: 'va12ms34i@gmail.com', // store in .env
    pass: 'gqph xoja nojk xoio',
  }
});

async function sendWelcomeEmail(to, name, store_amount,store_number) {
  const mailOptions = {
    from: 'va12ms34i@gmail.com',
    to,
    subject: "Welcome to JNTUA Store Account 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to J&UA Store, ${name}!</h2>
        <p>We’re excited to have you with us. Your store account has been created successfully.</p>
        <p><strong>Your Store_number:</strong> ${store_number}</p>
        <p><strong>Current Balance:</strong> ₹${store_amount}</p>
        <p>Come visit our store whenever you want and buy the products you love.</p>
        <p><strong>Store Hours:</strong> Every working day from 9:30 AM to 4:30 PM.</p>
        <p>Happy Shopping! 🛍️</p>
        <hr />
        <small>J&UA College Store</small>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };

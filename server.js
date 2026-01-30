const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const templates = {
    selected: (name, position) => `
Dear ${name},

We are pleased to inform you that you have been selected for the position of ${position}.

Please reply to this email to confirm your acceptance.

Best regards,
HR Team
`,
    rejected: (name, position) => `
Dear ${name},

Thank you for applying for the position of ${position}.

We regret to inform you that we have decided to move forward with other candidates.

Best regards,
HR Team
`
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// const transporter = nodemailer.createTransport({
//     secure: true,
//     host: 'smtp.gmail.com',
//     port: 465,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

app.post("/send-email", async (req, res) => {
    const { name, email, position, status } = req.body;

    if (!name || !email || !position || !status) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Application Status for ${position}`,
        text: templates[status](name, position)
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send email" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
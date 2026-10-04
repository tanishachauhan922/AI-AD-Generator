const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "AdVantage AI <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your AdVantage AI account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2>Verify your email</h2>

          <p>
            Thanks for creating an account on AdVantage AI.
          </p>

          <p>
            Your verification code is:
          </p>

          <h1 style="letter-spacing: 6px;">
            ${otp}
          </h1>

          <p>
            This code will expire in 10 minutes.
          </p>

          <p>
            If you did not create this account, you can ignore this email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error("Failed to send verification email");
    }

    console.log("Verification email sent:", data?.id);

    return data;
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail
};
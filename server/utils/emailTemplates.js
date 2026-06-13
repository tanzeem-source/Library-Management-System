export function generateVerificationOtpEmailTemplate(otpCode) {
    return `<div>
    <h2>Verify your email address</h2>
    <p>Dear User</p>
    <p>To complete your registration or login, please use the following code</p>
    <div>
    <span style="font-weight: bold; font-size: 1.2em;">${otpCode}</span>
    </div>
    <p>This code is valid for 15 minutes </p>
    <p>If you did not request this email, please ignore it </p>
    <footer>
    <p>Thank you, <br /> Bookworm Team </p>
    <p>Please do not reply to this email</p>
    </footer>
    </div>`;
}
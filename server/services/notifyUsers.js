import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      // Calculate 24 hours into the future
      const oneDayHence = new Date(Date.now() + 24 * 60 * 60 * 1000);

      console.log(
        `Checking for books due before: ${oneDayHence.toISOString()}`,
      );

      const borrowers = await Borrow.find({
        "user.dueDate": {
          $lt: oneDayHence,
        },
        "user.returnDate": null,
        "user.notified": false,
      });

      console.log(`Found ${borrowers.length} matching records.`);

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          console.log(`Sending advance notice to ${element.user.email}...`);

          await sendEmail({
            email: element.user.email,
            subject: "Upcoming book return reminder",
            message: `Hello ${element.user.name}, \n\nThis is a friendly reminder that the book you borrowed is due for return tomorrow. Kindly return the book to the library on time to avoid any late fines.\n\nThank you.`,
          });

          element.user.notified = true;
          element.markModified("user");
          await element.save();

          console.log(
            ` Success! Email sent and document updated for ${element.user.email}`,
          );
        }
      }
    } catch (error) {
      console.error("Some errors occurred while notifying users", error);
    }
  });
};

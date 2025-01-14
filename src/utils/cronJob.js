const cron = require("node-cron");
const connectionrequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../utils/sendEmail");

const yesterday = subDays(new Date(), 0);
const yesterdayStart = startOfDay(yesterday);
const yesterdayEnd = endOfDay(yesterdayStart);

cron.schedule("0 8 * * *", async () => {
  try {
    const pendingRequests = await connectionrequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("senderId receiverId");

    const listOfEmails = [...new Set(pendingRequests.map((req) => req.receiverId.emailId))];
    console.log(listOfEmails);

    for(const email of listOfEmails){
      const res = await sendEmail.run("New request pending for " + email, "Accept or delete the requests...");
      console.log(res);
    }
    
  } catch (err) {
    console.error(err);
  }
});

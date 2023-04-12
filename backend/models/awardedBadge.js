const mongoose = require("mongoose");

const awardedBadgeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Badge",
  },
  awarded: {
    type: Boolean,
    default: true,
  },
  awardedDate: {
    type: Date,
    default: undefined,
  },
});

awardedBadgeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const AwardedBadge = mongoose.model("AwardedBadge", awardedBadgeSchema);

module.exports = AwardedBadge;

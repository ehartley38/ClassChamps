const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String,
});

badgeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;

const mongoose = require("mongoose");

const validateUserMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("Không tìm thấy!");
  }
};

module.exports = { validateUserMongodbId };

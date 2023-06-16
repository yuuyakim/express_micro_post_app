const knex = require("../db/knex");

const TABLE_NAME = "relationships";

const followCount = async (userId) => {
  const followCount = await where({ user_id: userId });
  if (followCount === null) {
    throw new Error("User no found");
  }
  return followCount;
};

const followerCount = async (userId) => {
  const followerCount = await where({ follow_user_id: userId });
  if (followerCount === null) {
    throw new Error("User no found");
  }
  return followerCount;
};

const where = async (conditon) => {
  return await knex(TABLE_NAME)
    .where(conditon)
    .count("id as count")
    .then((results) => {
      if (results.length === 0) {
        return null;
      }
      return results[0];
    });
};

module.exports = {
  followCount,
  followerCount,
};

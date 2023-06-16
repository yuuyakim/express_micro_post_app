const knex = require("../db/knex");

const TABLE_NAME = "posts";

const countByUserId = async (userId) => {
  const postCount = await count({ user_id: userId });
  if (postCount === null) {
    throw new Error("PostTable no found");
  }
  return postCount;
};

const count = async (conditon) => {
  return await knex(TABLE_NAME)
    .where(conditon)
    .count("id as postCount")
    .then((results) => {
      if (results.length === 0) {
        return null;
      }
      return results[0];
    });
};

module.exports = {
  countByUserId,
};

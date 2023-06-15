const knex = require("../db/knex");

const TABLE_NAME = "users";

const findById = async (userId) => {
  const user = await where({ id: userId });
  if (user === null) {
    throw new Error("User no found");
  }
  return { ...user };
};

const where = async (conditon) => {
  return await knex(TABLE_NAME)
    .where(conditon)
    .then((results) => {
      if (results.length === 0) {
        return null;
      }
      return results[0];
    });
};

module.exports = {
  findById,
};

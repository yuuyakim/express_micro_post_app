const knex = require("../db/knex");

const TABLE_NAME = "relationships";

const followCount = async (userId) => {
  const followCount = await count({ user_id: userId });
  if (followCount === null) {
    throw new Error("User no found");
  }
  return followCount;
};

const followerCount = async (userId) => {
  const followerCount = await count({ follow_user_id: userId });
  if (followerCount === null) {
    throw new Error("User no found");
  }
  return followerCount;
};

const followList = async (userId) => {
  const relationshipsList = await where({ user_id: userId });
  const followList = [];

  if (relationshipsList === null || relationshipsList.length === 0) {
    return null;
  }
  relationshipsList.map((relationshipUser) => {
    followList.push(relationshipUser.follow_user_id);
  });

  return followList;
};

const unFollow = async (userId, followUserId) => {
  return await knex(TABLE_NAME)
    .where({ user_id: userId, follow_user_id: followUserId })
    .del();
};

const where = async (conditon) => {
  return await knex(TABLE_NAME)
    .where(conditon)
    .then((results) => {
      if (results.length === 0) {
        return null;
      }
      return results;
    });
};

const count = async (conditon) => {
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
  followList,
  unFollow,
};

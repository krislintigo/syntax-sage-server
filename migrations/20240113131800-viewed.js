module.exports = {
  async up(db, client) {
    await db.collection('terms').updateMany({}, {$set: {viewed: false}});
  },

  async down(db, client) {
  }
};

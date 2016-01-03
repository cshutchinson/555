
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(table){
    table.increments();
    table.string("reddit_id");
    table.string("reddit_name");
    table.string("reddit_created");
    table.text("reddit_url");
    table.text("reddit_title");
    table.string("reddit_created_utc");
  })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("posts")
  ]);
};

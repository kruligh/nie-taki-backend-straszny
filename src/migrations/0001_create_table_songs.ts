import { Knex } from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.withSchema("app").createTable("songs", table => {
    table.uuid("songId").primary();
    table.string("name").notNullable();
    table.string("author").notNullable();
    table.timestamp("addedAt").nullable().defaultTo(knex.fn.now());
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.withSchema("app").dropTable("songs");
};

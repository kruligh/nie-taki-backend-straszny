import chai from "chai";
import { Knex } from "knex";
import { Express } from "express";
import chaiAsPromised from "chai-as-promised";
import chaiHttp from "chai-http";
import { AppServices, buildAppServices } from "ntbs/app-services";
import { buildRouter } from "ntbs/router";
import { Table } from "ntbs/storages/db-schema";

chai.use(chaiAsPromised);
chai.use(chaiHttp);

export type TestApp = { services: AppServices; app: Express };
let testApp: TestApp;

afterEach("Clean up after test", async () => {
  if (testApp && testApp.services.storages.knex) {
    await clearDb(testApp.services.storages.knex);
  }
});

export async function getTestApp() {
  if (!testApp) {
    const testAppServices = await buildAppServices();
    testApp = {
      services: testAppServices,
      app: await buildRouter(testAppServices),
    };
  }
  return testApp;
}

async function clearDb(knex: Knex) {
  await knex(Table.Songs).delete();
}

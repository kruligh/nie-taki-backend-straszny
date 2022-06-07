import chai, { expect } from "chai";
import { getTestApp, TestApp } from "ntbs/setup-integration-tests.test";
import { uuid } from "ntbs/utils/uuid";
import { GetSongsResponse } from "ntbs/controllers/songs/get-songs";

describe("getSongsController", () => {
  let testApp: TestApp;
  let agent: ChaiHttp.Agent;

  beforeEach(async () => {
    testApp = await getTestApp();
    agent = chai.request.agent(testApp.app);
  });

  it("should return list of skills", async () => {
    // given
    await testApp.services.storages.songs.insert({
      songId: uuid(),
      addedAt: new Date(),
      author: "Krulig",
      name: "Ballada o podatkach",
    });
    await testApp.services.storages.songs.insert({
      songId: uuid(),
      addedAt: new Date(),
      author: "Krulig",
      name: "Ballada o spaniu",
    });

    // when
    const response = await agent.get("/songs");

    //then
    const responseBody = response.body as GetSongsResponse;
    expect(responseBody.songs.length).to.be.eq(2);
  });
});

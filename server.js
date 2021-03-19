import * as Environment from "~/common/environment";
import * as Strings from "~/common/strings";

import express from "express";
import next from "next";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";

const app = next({
  dev: !Environment.IS_PRODUCTION,
  dir: __dirname,
  quiet: false,
});

const handler = app.getRequestHandler();

const getSlingshotDataAsJSON = async () => {
  const response = await fetch(
    "https://space-race-slingshot-phase2.s3.amazonaws.com/prod/unfiltered_basic_stats.json"
  );
  const json = await response.json();
  return json;
};

const getFilecoinPriceDataAsJSON = async () => {
  const response = await fetch(
    "https://cloud.iexapis.com/stable/crypto/filusdt/price?token=pk_aa330a89a4724944ae1a525879a19f2d"
  );
  const json = await response.json();
  return json;
};

const getMinerIndexDataAsJSON = async () => {
  const response = await fetch(
    "https://minerindex.hub.textile.io/v1/index/query?sort.ascending=true&sort.field=ACTIVE_SECTORS&offset=0&limit=100"
  );
  const json = await response.json();
  return json;
};

const getFilRepMinerIndexDataAsJSON = async () => {
  const response = await fetch("https://api.filrep.io/api/v1/miners");

  const json = await response.json();
  return json;
};

app.prepare().then(async () => {
  const server = express();

  server.use(cors());
  server.use(bodyParser.json({ limit: "10mb" }));
  server.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  if (Environment.IS_PRODUCTION) {
    server.use(compression());
  }

  server.use("/public", express.static("public"));

  server.get("/", async (r, s) => {
    const { payload, epoch } = await getSlingshotDataAsJSON();
    const { price, symbol } = await getFilecoinPriceDataAsJSON();
    const { miners } = await getMinerIndexDataAsJSON();
    const response = await getFilRepMinerIndexDataAsJSON();

    const query = {
      epoch,
      price,
      symbol,
      miners: { textile: miners, filrep: response.miners },
      ...payload,
    };
    return app.render(r, s, "/", query);
  });

  server.all("*", async (r, s) => handler(r, s, r.url));

  server.listen(Environment.PORT, async (e) => {
    if (e) throw e;

    console.log(`[ miners ] client: http://localhost:${Environment.PORT}`);
  });
});

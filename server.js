import * as Environment from '~/common/environment';
import * as Strings from '~/common/strings';
import * as NodeCache from '~/common/node-cache';
import * as Data from '~/common/node-data-parse';

import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import moment from 'moment';
import crypto from 'crypto';

import { v4 as uuidv4 } from 'uuid';

const app = next({
  dev: !Environment.IS_PRODUCTION,
  dir: __dirname,
  quiet: false,
});

const handler = app.getRequestHandler();

global.locks = { fetch: false };

const getAthenaDataAsJSON = async () => {
  let index = 1;
  const data = { page_index: index, page_size: 100 };

  const headers = {
    AppId: process.env.ATHENA_EXPLORER_APP_ID,
    Timestamp: new moment().format('YYYY-MM-DDTHH:mm:ssZZ'),
    SignatureVersion: 'V1',
    SignatureMethod: 'HMAC-SHA256',
    SignatureNonce: uuidv4(),
  };

  function sign(body, opts = {}) {
    let sign_str = `body=${body ? JSON.stringify(body || {}) : ''}&timestamp=${opts.Timestamp}&signatureNonce=${opts.SignatureNonce}`;
    const hmac = crypto.createHmac('sha256', opts.secret);
    hmac.update(sign_str);
    const s = hmac.digest();
    return s.toString('hex');
  }

  const signature = sign(null, { ...headers, secret: process.env.ATHENA_EXPLORER_SECRET });

  const response = await fetch('https://openapi.atpool.com/v1/data/miners', {
    method: 'GET',
    form: data,
    headers: {
      ...headers,
      Signature: signature,
    },
  });

  console.log(response);
  const json = await response.json();
  console.log(json);
  return json;
};

const getEstuaryStatsAsJSON = async () => {
  console.log('fetching ...');
  const response = await fetch('https://api.estuary.tech/public/stats');
  const json = await response.json();
  return json;
};

const getEstuaryMinersAsJSON = async () => {
  console.log('fetching ...');
  const response = await fetch('https://api.estuary.tech/public/miners');
  const json = await response.json();
  return json;
};

const getSlingshotDataAsJSON = async () => {
  console.log('fetching ...');
  const response = await fetch('https://space-race-slingshot-phase2.s3.amazonaws.com/prod/unfiltered_basic_stats.json');
  const json = await response.json();
  return json;
};

const getFilecoinPriceDataAsJSON = async () => {
  console.log('fetching ...');
  const response = await fetch(`https://cloud.iexapis.com/stable/crypto/filusdt/price?token=${process.env.IEXCLOUD_TOKEN}`);
  const json = await response.json();
  return json;
};

const getMinerIndexDataAsJSON = async () => {
  let miners = [];
  let canContinue = true;
  let offset = 0;

  while (offset < 4000 && canContinue) {
    console.log(`fetching ... textile ... ${offset} + 50...`);
    const response = await fetch(`https://minerindex.hub.textile.io/v1/index/query?sort.ascending=true&sort.field=ACTIVE_SECTORS&offset=${offset}&limit=50`);
    const json = await response.json();

    if (!json.miners.length) {
      canContinue = false;
      break;
    }

    miners = [...miners, ...json.miners];
    offset = offset + 50;
  }

  return { miners };
};

const getFilRepMinerIndexDataAsJSON = async () => {
  console.log('fetching ...');
  const response = await fetch('https://api.filrep.io/api/v1/miners');

  const json = await response.json();
  return json;
};

app.prepare().then(async () => {
  const server = express();

  server.use(cors());
  server.use(bodyParser.json({ limit: '10mb' }));
  server.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  if (Environment.IS_PRODUCTION) {
    server.use(compression());
  }

  server.use('/public', express.static('public'));

  server.get('/refresh', async (r, s) => {
    const cache = NodeCache.accessCache('data.cache');

    if (global.locks.fetch) {
      return s.status(200).json({});
    }

    console.log('[ CACHE ] FORCED REFRESH ...');
    const { payload, epoch } = await getSlingshotDataAsJSON();
    const { price, symbol } = await getFilecoinPriceDataAsJSON();
    const { miners } = await getMinerIndexDataAsJSON();
    const athenaResponse = await getAthenaDataAsJSON();
    const estuaryMiners = await getEstuaryMinersAsJSON();
    const estuaryStats = await getEstuaryStatsAsJSON();
    const response = await getFilRepMinerIndexDataAsJSON();

    const data = {
      epoch,
      price,
      symbol,
      estuaryStats,
      athenaResponse,
      miners: Data.getMinersArray({
        athena: athenaResponse && athenaResponse.data ? athenaResponse.data.miners : [],
        textile: miners,
        filrep: response.miners,
        estuary: estuaryMiners,
      }),
      count: {
        athena: athenaResponse && athenaResponse.data ? athenaResponse.data.total_count : 0,
        textile: miners.length,
        filrep: response.miners.length,
        estuary: estuaryMiners.length,
      },
      athena: {
        deals: athenaResponse && athenaResponse.data ? athenaResponse.data.storage_deals : 0,
        verifiedDeals: athenaResponse && athenaResponse.data ? athenaResponse.data.verified_storageDeals : 0,
        data: athenaResponse && athenaResponse.data ? athenaResponse.data.data_stored : 0,
        verifiedData: athenaResponse && athenaResponse.data ? athenaResponse.data.verified_dataStored : 0,
      },
      ...payload,
    };

    console.log('[ CACHE ] STORING NEW ', data);
    await cache.put('store', data, 1800000 * 12);

    return s.status(200).json(data);
  });

  server.get('/data', async (r, s) => {
    console.log(NodeCache);
    const cache = NodeCache.accessCache('data.cache');
    const store = await cache.get('store');

    console.log('[ CACHE ]', !!store);

    if (store || global.locks.fetch) {
      if (!store) {
        return s.status(200).json({ rebuilding: true });
      }

      console.log('[ CACHE ] RETRIEVING ...');

      // NOTE(jim): If invalid, we fire a request off but not async
      if (store.__invalidated) {
        const protocol = r.headers['x-forwarded-proto'] || 'http';
        const baseURL = r ? `${protocol}://${r.headers.host}` : '';
        fetch(`${baseURL}/refresh`);
      }

      return s.status(200).json(store);
    }

    global.locks.fetch = true;
    console.log('[ LOCK ] ENFORCED');

    console.log('[ CACHE ] REBUILDING ...');
    const { payload, epoch } = await getSlingshotDataAsJSON();
    const { price, symbol } = await getFilecoinPriceDataAsJSON();
    const { miners } = await getMinerIndexDataAsJSON();
    const athenaResponse = await getAthenaDataAsJSON();
    const estuaryMiners = await getEstuaryMinersAsJSON();
    const estuaryStats = await getEstuaryStatsAsJSON();
    const response = await getFilRepMinerIndexDataAsJSON();

    const data = {
      epoch,
      price,
      symbol,
      estuaryStats,
      athenaResponse,
      miners: Data.getMinersArray({
        athena: athenaResponse && athenaResponse.data ? athenaResponse.data.miners : [],
        textile: miners,
        filrep: response.miners,
        estuary: estuaryMiners,
      }),
      count: {
        athena: athenaResponse && athenaResponse.data ? athenaResponse.data.total_count : 0,
        textile: miners.length,
        filrep: response.miners.length,
        estuary: estuaryMiners.length,
      },
      athena: {
        deals: athenaResponse && athenaResponse.data ? athenaResponse.data.storage_deals : 0,
        verifiedDeals: athenaResponse && athenaResponse.data ? athenaResponse.data.verified_storageDeals : 0,
        data: athenaResponse && athenaResponse.data ? athenaResponse.data.data_stored : 0,
        verifiedData: athenaResponse && athenaResponse.data ? athenaResponse.data.verified_dataStored : 0,
      },
      ...payload,
    };

    console.log('[ CACHE ] STORING NEW ', data);
    await cache.put('store', data, 1800000 * 12);

    console.log('[ LOCK ] LIFTED');
    global.locks.fetch = false;

    return s.status(200).json(data);
  });

  server.get('/', async (r, s) => {
    const protocol = r.headers['x-forwarded-proto'] || 'http';
    const baseURL = r ? `${protocol}://${r.headers.host}` : '';
    const dataRequest = await fetch(`${baseURL}/data`);
    const data = await dataRequest.json();

    return app.render(r, s, '/', {
      ...data,
    });
  });

  server.all('*', async (r, s) => handler(r, s, r.url));

  server.listen(Environment.PORT, async (e) => {
    if (e) throw e;

    console.log(`[ application-research/miners ] http://localhost:${Environment.PORT}`);
  });
});

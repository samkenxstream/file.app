import * as Strings from "~/common/strings";

export const getMinersArray = (data) => {
  const miners = [];
  const added = {};
  const estuary = {};

  for (let m of data.estuary) {
    if (Strings.isEmpty(m.version)) {
      continue;
    }

    estuary[m.addr] = m;
  }

  for (let m of data.filrep) {
    if (!m.rawPower) {
      continue;
    }

    if (!m.price) {
      continue;
    }

    if (!m.freeSpace) {
      continue;
    }

    if (Number(m.storageDeals.total) < 1) {
      continue;
    }

    if (Strings.isEmpty(m.isoCode)) {
      continue;
    }

    added[m.address] = true;

    const newMiner = {
      address: m.address,
      space: { free: m.freeSpace, used: m.storageDeals.dataStored },
      iso: m.isoCode,
      region: m.region,
      maxPieceSize: m.maxPieceSize,
      minPieceSize: m.minPieceSize,
      price: m.price,
      verified: m.verifiedPrice,
      totalCost: m.storageDeals.averagePrice * m.storageDeals.total,
      power: m.rawPower,
      deals: m.storageDeals.total,
      estuary: estuary[m.address] ? estuary[m.address] : null,
    };

    miners.push(newMiner);
  }

  for (let m of data.textile) {
    if (!m.miner) {
      continue;
    }

    if (added[m.miner.minerAddr]) {
      continue;
    }

    if (
      Strings.isEmpty(m.miner.filecoin.sectorSize) ||
      String(m.miner.filecoin.sectorSize) === "0"
    ) {
      continue;
    }

    if (
      Strings.isEmpty(m.miner.filecoin.activeSectors) ||
      String(m.miner.filecoin.activeSectors) === "0"
    ) {
      continue;
    }

    if (Number(m.miner.textile.dealsSummary.total) < 1) {
      continue;
    }

    const newMiner = {
      address: m.miner.minerAddr,
      space: {
        free: m.miner.filecoin.sectorSize,
        used: m.miner.filecoin.activeSectors,
      },
      iso: m.miner.metadata.location,
      region: null,
      maxPieceSize: m.miner.filecoin.maxPieceSize,
      minPieceSize: m.miner.filecoin.minPieceSize,
      price: m.miner.filecoin.askPrice,
      verified: m.miner.filecoin.askVerifiedPrice,
      totalCost:
        m.miner.filecoin.askVerifiedPrice * m.miner.textile.dealsSummary.total,
      power: m.miner.filecoin.relativePower,
      deals: m.miner.textile.dealsSummary.total,
      estuary: estuary[m.miner.minerAddr] ? estuary[m.miner.minerAddr] : null,
    };

    miners.push(newMiner);
  }

  return miners;
};

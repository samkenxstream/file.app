import { FilecoinNumber, Converter } from "@glif/filecoin-number";

export function formatAsFilecoin(number) {
  return `${number} FIL`;
}

export function attoFILtoFIL(number = 0) {
  const filecoinNumber = new FilecoinNumber(`${number}`, "attofil");
  const inFil = filecoinNumber.toFil();
  return inFil;
}

export function getAttoFILtoUSD(number = 0, price) {
  const conversion = attoFILtoFIL(number);
  const usd = Number(conversion) * Number(price);
  return usd;
}

export function percentageCheaper(attoFIL, priceAmazon, currentUSD) {
  const filecoin = getAttoFILtoUSD(attoFIL, currentUSD);
  if (filecoin <= 0) {
    return "0.00% the cost of Amazon";
  }

  return `${((filecoin / priceAmazon) * 100).toFixed(
    2
  )}% the cost of Amazon S3`;
}

export function compareFilecoinToAmazon(
  priceFilecoin,
  priceAmazon,
  currentUSD
) {
  const filecoin = getAttoFILtoUSD(priceFilecoin, currentUSD);

  if (filecoin <= 0) {
    return "Infinity times cheaper";
  }

  let percentage = 0;
  if (filecoin < priceAmazon) {
    const calculation = ((priceAmazon - filecoin) / filecoin) * 100;
    return `${calculation}% cheaper`;
  } else {
    return "It is not cheaper.";
  }
}

export function inFIL(number = 0, price) {
  const filecoinNumber = new FilecoinNumber(`${number}`, "attofil");
  const inFil = filecoinNumber.toFil();

  let candidate = `${formatAsFilecoin(inFil)}`;

  if (!isEmpty(price)) {
    let usd = Number(inFil) * Number(price);
    if (usd >= 0.0000001) {
      usd = `$${usd.toFixed(7)} USD`;
    } else {
      usd = `$0.00 USD`;
    }

    candidate = `${candidate} ⇄ ${usd}`;
  }

  return candidate;
}

export function inUSD(number, price) {
  const filecoinNumber = new FilecoinNumber(`${number}`, "attofil");
  const inFil = filecoinNumber.toFil();

  let candidate = `${formatAsFilecoin(inFil)}`;

  if (!isEmpty(price)) {
    let usd = Number(inFil) * Number(price);

    candidate = `$${usd} USD`;
  }

  return candidate;
}

export const isEmpty = (string) => {
  // NOTE(jim): This is not empty when its coerced into a string.
  if (string === 0) {
    return false;
  }

  if (!string) {
    return true;
  }

  if (typeof string === "object") {
    return true;
  }

  if (string.length === 0) {
    return true;
  }

  string = string.toString();

  return !string.trim();
};

export const toDate = (date) => {
  return date.toUTCString();
};

export const toDateSinceEpoch = (epoch) => {
  const d = new Date(1000 * (epoch * 30 + 1598306400));

  return toDate(d);
};

export const bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
};

export const bytesToGigaByte = (n = 0) => {
  return n / (1024 * 1024 * 1024);
};

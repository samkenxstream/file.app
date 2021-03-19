import fs from "fs";
import path from "path";

class Cache {
  config = null;
  filename = null;

  constructor(cacheFileName, config) {
    console.log("[ process.cwd() ]", process.cwd());
    this.filename = path.join(process.cwd(), cacheFileName);
    console.log("[ cache file ]", this.filename);
  }

  async put(key, value, ms) {
    let data = null;
    try {
      const response = await fs.promises.readFile(this.filename, "utf8");
      data = JSON.parse(response);
    } catch (error) {
      console.log(error.message);
      data = {};
    }

    data[key] = {
      data: value,
      validUntil: new Date().getTime() + ms,
    };

    await fs.promises.writeFile(this.filename, JSON.stringify(data), "utf8");
    this.schedule(key, ms);
    return data[key];
  }

  async get(key) {
    try {
      const data = JSON.parse(
        await fs.promises.readFile(this.filename, "utf8")
      )[key];

      if (data.validUntil) {
        if (new Date().getTime() >= data.validUntil) {
          return { ...data, __invalidated: true };
        }
      }

      return data.data;
    } catch (error) {
      return null;
    }
  }

  schedule(key, ms) {
    const that = this;
    setTimeout(async () => {
      const data = JSON.parse(
        await fs.promises.readFile(that.filename, "utf8")
      );
      delete data[key];
      await fs.promises.writeFile(that.filename, JSON.stringify(data), "utf8");
    }, ms);
  }
}

function accessCache(filename, config) {
  return new Cache(filename, config);
}

export { accessCache };

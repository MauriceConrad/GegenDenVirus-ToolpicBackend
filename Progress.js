const fs = require('fs-extra');


class Progress {
  constructor(props, id) {
    const self = this;

    this.tmpFilePath = Progress.generatePath(id);


    for (let key of props) {
      if (!(key in this)) {
        Object.defineProperty(this, key, {
          get() {
            const data = self.data;
            return data[key] || 0;
          },
          set(val) {
            const data = self.data;
            data[key] = val;
            self.data = data;
          }
        });
      }
    }

  }
  get data() {
    try {
      const contents = fs.readFileSync(this.tmpFilePath);
      const obj = JSON.parse(contents);
      return obj;
    }
    catch (e) {
      return {};
    }
  }
  set data(obj) {
    fs.ensureFileSync(this.tmpFilePath);
    fs.writeFileSync(this.tmpFilePath, JSON.stringify(obj));
  }
  static generatePath(id) {
    const path = __dirname + "/progress/" + id + ".json";
    return path;
  }
}


module.exports = Progress;

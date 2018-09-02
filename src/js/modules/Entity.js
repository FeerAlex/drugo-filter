export default class Entity {
  constructor(dataObj) {
    this.data = this.data || [];
    this.dataObj = dataObj;
  }

  async update(users) {
    await users.map((user) => this.data.push(user));

    return this;
  }

  remove(id) {
    this.data = this.data.filter(user => user.id !== id);
  }

  save() {
    let data = JSON.stringify(this.data);

    localStorage[this.dataObj] = data;
  }

  get() {
    let data = JSON.parse(localStorage[this.dataObj] || null);

    return data;
  }
}
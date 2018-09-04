export default class Entity {
  constructor(dataObj) {
    this.data = this.data || [];
    this.dataObj = dataObj;
  }

  async update(user) {
    if (this.find(user.id)) return;

    await this.data.push(user);

    return this;
  }

  find(id) {
    return this.data.find(user => user.id === id);
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

  loadData() {
    return this.data;
  }
}
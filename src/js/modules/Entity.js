export default class Entity {
  constructor(dataObj) {
    this.data = this.data || [];
    this.dataObj = dataObj;
  }

  update(prop, val) {

    return this;
  }
}
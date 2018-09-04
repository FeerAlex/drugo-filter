import Entity from './modules/Entity';

export default class SpisokEntity extends Entity {
  constructor() {
    super('spisok');

    this.init();
  }

  init() {
    let data = this.get();

    this.data = data || [];
  }
}
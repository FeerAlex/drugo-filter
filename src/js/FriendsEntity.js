import Entity from './modules/Entity';

export default class FriendsEntity extends Entity {
  constructor() {
    super('friends');

    this.init();
  }

  init() {
    let data = this.get();

    this.data = data || [];
  }
}
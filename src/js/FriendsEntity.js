import Entity from './modules/Entity';
import vk from './modules/vk';
import config from './config.json';

export default class FriendsEntity extends Entity {
  constructor() {
    super('friends');

    this.loadData();
  }

  async loadData() {
    await vk.login(config.vk.apiID, 2);
    let data = await vk.getFriends({ fields: 'photo_100' });

    this.data = data.items;
  }
}
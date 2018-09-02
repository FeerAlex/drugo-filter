import Grid           from "./modules/Grid";
import FriendsEntity  from './FriendsEntity';

export default class SpisokGrid extends Grid {
  constructor(opts) {
    super(opts);

    this.setTitleName("Ваши друзья");
    super.init();
  }

  async getEntityData() {
    return await new FriendsEntity();
  }
}
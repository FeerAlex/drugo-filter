import Grid           from "./modules/Grid";
import FriendsEntity  from './FriendsEntity';

export default class FriendsGrid extends Grid {
  constructor(opts) {
    super(opts);
  }

  init() {
    this.setTitleName("Ваши друзья");
    this.entity = new FriendsEntity();
    this.reload();

    super.init();
  }
}
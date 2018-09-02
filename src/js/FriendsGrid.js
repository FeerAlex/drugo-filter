import Grid           from "./modules/Grid";
import FriendsEntity  from './FriendsEntity';

export default class SpisokGrid extends Grid {
  constructor(opts) {
    super(opts);

    let entity = new FriendsEntity();

    // this.data = entity.data;

    this.setData(entity.data);

    console.log(this.data);


    this.setTitleName("Ваши друзья");
    super.init();
  }
}
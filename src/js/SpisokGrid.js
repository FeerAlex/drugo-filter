import Grid         from "./modules/Grid";
import SpisokEntity from './SpisokEntity';

export default class SpisokGrid extends Grid {
  constructor(opts) {
    super(opts);
  }

  init() {
    this.entity = new SpisokEntity();

    this.props = [
      { name: 'first_name' },
      { name: 'last_name' },
      { name: 'photo_100' }
    ];

    this.setTitleName('Друзья в списке');

    this.data = [];

    super.init();
  }
}
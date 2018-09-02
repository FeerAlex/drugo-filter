import Grid         from "./modules/Grid";
import SpisokEntity from './SpisokEntity';

export default class SpisokGrid extends Grid {
  constructor(opts) {
    super(opts);
  }

  init() {
      this.setTitleName('Друзья в списке');
      this.entity = new SpisokEntity();
      this.reload();

      super.init();
  }
}
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

    this.data = [{
        first_name : "Николай",
        id : 95541,
        last_name : "Чернобаев",
        photo_100: "https://pp.userapi.com/c637523/v637523734/6839a/yXjq0JvNjX8.jpg?ava=1"
    }];


    super.init();
  }
}
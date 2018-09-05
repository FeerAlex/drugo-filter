import '../scss/style.scss';
import App from "./App";
import vk from './modules/vk';
import config from './config.json';

let friends = localStorage.friends;

let load = async () => {
  try {
    await vk.login(config.vk.apiID, 2);
    let data = await vk.getFriends({ fields: 'photo_100' });

    localStorage.friends = JSON.stringify(data.items);
    localStorage.spisok = null;

    await new App();
  } catch (err) {
    alert(err);
  }
};

if (friends) {
  new App();
} else {
  load();
}
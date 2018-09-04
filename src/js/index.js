import '../scss/style.scss';
import App from "./App";
import FriendsEntity from "./FriendsEntity";

let friends = localStorage.friends;

let load = async () => {
  await new FriendsEntity().loadVkData().then(data => {
    localStorage.friends = JSON.stringify(data);
    localStorage.spisok = null;
  });

  await new App();
};

if (friends) {
  new App();
} else {
  load();
}
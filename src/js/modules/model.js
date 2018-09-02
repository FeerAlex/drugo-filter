export default {
  login(appId, perms) {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: appId
      });

      VK.Auth.login(res => {
        if (res.session) {
          resolve(res);
        } else {
          reject(new Error('Не удалось авторизироваться!'));
        }
      }, perms);
    });
  },

  callAPI(method, params) {
    params.v = params.v || '5.76';

    return new Promise((resolve, reject) => {
      VK.api(method, params, res => {
        if (res.error) {
          reject(new Error(res.error.error_msg));
        } else {
          resolve(res.response);
        }
      });
    });
  },

  getUser(params = {}) {
    return this.callAPI('users.get', params);
  },

  getFriends(params = {}) {
    return this.callAPI('friends.get', params);
  }
}
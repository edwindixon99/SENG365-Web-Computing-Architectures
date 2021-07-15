const users = require('../controllers/user.server.controller');
module.exports = function(app) {
    app.route(app.rootUrl +'/users/:id')
        .get(users.read);
    app.route(app.rootUrl +'/users/register')
        .post(users.create);
    app.route(app.rootUrl +'/users/login')
         .post(users.logIn);
    app.route(app.rootUrl +'/users/logout')
         .post(users.logOut);
    app.route(app.rootUrl +'/users/:id')
        .patch(users.change);
};

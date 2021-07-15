const userPhotos = require('../controllers/users.photos.server.controller');
module.exports = function(app) {
    app.route(app.rootUrl + "/users/:id/photo")
        .get(userPhotos.read);
    app.route(app.rootUrl + "/users/:id/photo")
        .put(userPhotos.upload);
    app.route(app.rootUrl + "/users/:id/photo")
        .delete(userPhotos.remove);
};
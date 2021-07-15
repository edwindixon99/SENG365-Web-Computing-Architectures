const Photos = require('../controllers/petitions.photo.server.controller');
module.exports = function(app) {
    app.route(app.rootUrl + "/petitions/:id/photo")
        .get(Photos.read);
    app.route(app.rootUrl + "/petitions/:id/photo")
        .put(Photos.upload);
};
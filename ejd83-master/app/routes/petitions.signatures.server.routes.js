const petitions = require('../controllers/petitions.signatures.server.controller');
module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .get(petitions.list);
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .post(petitions.submit);
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .delete(petitions.remove);
};

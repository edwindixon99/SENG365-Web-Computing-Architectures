const petitions = require('../controllers/petitions.server.controller');
module.exports = function(app) {
    app.route(app.rootUrl +'/petitions')
        .get(petitions.list);
    app.route(app.rootUrl + '/petitions/categories')
        .get(petitions.readCategories);
    app.route(app.rootUrl + '/petitions/:id')
        .get(petitions.read);
    app.route(app.rootUrl + '/petitions/')
        .post(petitions.create);
    app.route(app.rootUrl + '/petitions/:id')
        .patch(petitions.change);
    app.route(app.rootUrl + '/petitions/:id')
        .delete(petitions.remove);
};

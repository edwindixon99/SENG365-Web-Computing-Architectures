const Petition = require('../models/petitions.server.model');


exports.list = async function(req, res){
    try {
        let params = req.query;
        var sqlparams = [], startIndex = params.startIndex, count = params.count, q = params.q;
        let categoryId = params.categoryId, authorId = params.authorId, sortBy = params.sortBy;

      //startIndex
        if (startIndex != undefined) {
            if (!isNaN(startIndex)) {
                sqlparams.push(parseInt(startIndex));
            }
        }else {
            sqlparams.push(0);
        }
        //count
        if (count != undefined) {
            if (!isNaN(count)) {
                sqlparams.push(parseInt(count));
            }
        } else {
            sqlparams.push(null);
        }
        //q
        if (q != undefined) {
            sqlparams.push(`%${q}%`);
        } else {
            sqlparams.push(null);
        }

        //authorId
        if (categoryId != undefined) {
            if (!isNaN(categoryId)) {
                sqlparams.push(parseInt(categoryId));
            }
        }else {
            sqlparams.push(null);
        }
        //categoryId
        if (authorId != undefined) {
            if (!isNaN(authorId)) {
                sqlparams.push(parseInt(authorId));
            }
        }else {
            sqlparams.push(null);
        }
        //sortBy
        let sortString = 'SIGNATURES_DESC';
        if (sortBy != undefined) {
            sqlparams.push(sortBy);
        } else {
            sqlparams.push(sortString);
        }

        const result = await Petition.getAll(sqlparams);
        let final = [];
        for (let i=0; i < result.length ;i++) {
            final.push({
                "petitionId": result[i].petition_id,
                "title": result[i].title,
                "category": result[i].c_name,
                "authorName": result[i].authorname,
                "signatureCount": result[i].count
            })
        }
        return res.status(200)
            .send(final);
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};
exports.read = async function(req, res){
    try {
        const id = req.params.id;

        let inDB = await Petition.idInDB(id);
        if (inDB.length === 0) {
            res.status(404).send();
            return;
        }
        let sCount = 0;
        const result = await Petition.getOne(id);
        if (result[0].count != undefined) {
             sCount = result[0].count;
        }
        return res.status(200)
            .send({
                "petitionId": result[0].petition_id,
                "title": result[0].title,
                "category": result[0].category_name,
                "authorName": result[0].name,
                "signatureCount": sCount,
                "description": result[0].description,
                "authorId": result[0].author_id,
                "authorCity": result[0].city,
                "authorCountry": result[0].country,
                "createdDate": result[0].created_date,
                "closingDate": result[0].closing_date
            });
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

exports.readCategories = async function(req, res){
    try {
        const result = await Petition.getCats();
        let final = [];
        for (var i=0; i < result.length ;i++) {
            final.push({
                "categoryId": result[i].category_id,
                "name": result[i].name
            });
        }
        return res.status(200)
            .send(final);
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

exports.create = async function(req, res){
    try {
        let auth_token = req.headers['x-authorization'];
        let userId = await Petition.isLoggedOn(auth_token);     // checks someone is logged in
        if (userId.length == 0) {
            res.status(401).send();
            return;
        }

        let now = new Date();

        let title = req.body.title, desc = req.body.description, catId = req.body.categoryId,
            closeDate = req.body.closingDate;

        if (typeof(title) != "string" || typeof(desc) != "string" || !Number.isInteger(catId)) {
            res.statusMessage =("BAD REQUEST");
            res.status(400).send();
            return;
        }
        if (title.length === 0 || desc.length === 0) {
            res.statusMessage =("mandatory fields incomplete");
            res.status(400).send();
            return;
        }
        if (closeDate != undefined) {

            if (Date.parse(closeDate === 'NaN')) {
                res.statusMessage =("DATE wrong format");
                res.status(400).send();
                return;
            }
            if (new Date(closeDate) < new Date()) {
                res.statusMessage =("DATE too old");
                res.status(400).send();
                return;
            }

        } else {
            closeDate = null;
        }

        let catExists = await Petition.checkCat(catId);
        if (catExists.length == 0) {
            res.statusMessage = "category doesn't exist"
            res.status(400).send();
            return;
        }



        userId = userId[0].user_id;

        let details = [title, desc, userId, catId, now, closeDate];
        const result = await Petition.add(details);
        res.status(201).send({"petitionId": result.insertId});
        return;
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

exports.change = async function(req, res){
    try {

        let now = new Date();
        let id = req.params.id;
        let title = req.body.title, desc = req.body.description, catId = req.body.categoryId,
            closeDate = req.body.closingDate;
        let body = [title, desc];
        let details = [];

        let auth_token = req.headers['x-authorization'];
        let userId = await Petition.isLoggedOn(auth_token);

        if (userId.length == 0) {
            res.statusMessage =("invalid auth token");
            res.status(401).send();
            return;
        }

        let petitionsAuthored = await Petition.authenticate([userId[0].user_id, id]);     // checks someone is logged in



        if (petitionsAuthored.length == 0) {
            res.statusMessage =("NOT AUTH");
            res.status(403).send();
            return;
        }

        if (title == undefined && desc == undefined && catId == undefined && closeDate == undefined){
            res.statusMessage = ("Bad Request no valid body inputs given");
            res.status(400).send();
            return;
        }

        let inDB = await Petition.idInDB(id);
        if (inDB.length === 0) {
            res.status(404).send();
            return;
        }
        for (let i=0; i<2; i++) {
            if (body[i] != undefined) {
                if (typeof(body[i]) != "string") {
                    res.statusMessage =  ("Body inputs must be type string");
                    res.status(400).send();
                    return;
                }
                if (body[i].length == 0) {
                    res.statusMessage =  ("Body input string is too short");
                    res.status(400).send();
                    return;
                } else {
                    details.push(body[i]);
                }
            } else {
                details.push(null);
            }
        }
        if (catId != undefined) {
            if (!Number.isInteger(catId)) {
                res.statusMessage =  ("BAD REQUEST");
                res.status(400).send();
                return;
            }
            let catExists = await Petition.checkCat(catId);
            if (catExists.length == 0) {
                res.status(400).send();
                res.statusMessage =  ("category doesnt exist");
                return;
            } else {
                details.push(catId);
            }
        } else {
            details.push(null);
        }
        if (closeDate != undefined) {
            if (Date.parse(closeDate == NaN)) {
            //if (!closeDate.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}$/)) {
                res.statusMessage =  ("DATE wrong format");
                res.status(400).send();
                return;
            }
            if (new Date(closeDate) < new Date()) {
                res.statusMessage =  ("DATE too old");
                res.status(400).send();
                return;
            } else {
            details.push(closeDate);
            }
        } else {
            details.push(null);
        }



        let expiredDate  = await Petition.checkClosingDate(id);

        if (expiredDate[0].closeDate < now) {
            res.statusMessage =  ("petition has expired");
            res.status(403).send();
            return;
        }

        details.push(id);
        let final = await Petition.update(details);

        res.status(200).send();
        return;

    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

exports.remove = async function(req, res){
    try {
        let id = req.params.id;
        let auth_token = req.headers['x-authorization'];
        let userId = await Petition.isLoggedOn(auth_token);

        if (userId.length == 0) {
            res.statusMessage =  ("invalid auth token");
            res.status(401).send();
            return;
        }

        let petitionsAuthored = await Petition.authenticate([userId[0].user_id, id]);     // checks someone is logged in


        if (petitionsAuthored.length == 0) {
            res.statusMessage =  ("NOT AUTH");
            res.status(403).send();
            return;
        }

        let inDB = await Petition.idInDB(id);
        if (inDB.length === 0) {
            res.status(404).send();
            return;
        }

        await Petition.remove(id);
        res.status(200).send();
        return;
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};
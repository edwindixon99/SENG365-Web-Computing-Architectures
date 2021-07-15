const Signatures = require('../models/petitions.signatures.server.model');
const Petitions = require('../models/petitions.server.model');

exports.list = async function(req, res){
    try {
        const id = req.params.id;
        let petitionExists = await Petitions.idInDB(id);
        if (petitionExists.length == 0) {
            res.status(404).send();
            return;
        }
        const result = await Signatures.getAll(id);
        let final = [];
        for (var i=0; i < result.length ;i++) {
            final.push({
                "signatoryId": result[i].signatory_id,
                "name": result[i].name,
                "city": result[i].city,
                "country": result[i].country,
                "signedDate": result[i].signed_date
            })
        }
        res.status(200).send(final);
        return;
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`);
    }
};

exports.submit = async function(req, res){
    try {
        const id = req.params.id;
        let auth_token = req.headers['x-authorization'];
        let userId = await Petitions.isLoggedOn(auth_token);
        // error 403 forbidden when should be 200

        if (userId.length == 0) {
            res.statusMessage = ("invalid auth token");
            res.status(401).send();
            return;
        }
        userId = userId[0].user_id;

        let petitionExists = await Petitions.idInDB(id);
        if (petitionExists.length == 0) {
            res.status(404).send();
            return;
        }

        const alreadySigned = await Signatures.alreadySigned([userId, id]);


        if (alreadySigned.length != 0) {
            res.statusMessage = ("Already signed this Petition");
            res.status(403).send();
            return;
        }
        let now = new Date();
        let closingDate = await Petitions.checkClosingDate(id);
        closingDate = closingDate[0].closing_date;
        if (new Date(closingDate) < new Date()) {
            res.statusMessage =  ("DATE TOO LATE");
            res.status(403).send();
            return;
        }

        await Signatures.sign([userId, id, now]);
        res.status(201).send();
        return;
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

exports.remove = async function(req, res){
    try {
        const id = req.params.id;
        let auth_token = req.headers['x-authorization'];
        let userId = await Petitions.isLoggedOn(auth_token);



        if (userId.length == 0) {
            res.statusMessage =  ("invalid auth token");
            res.status(401).send();
            return;
        }
        userId = userId[0].user_id;

        let petitionExists = await Petitions.idInDB(id);
        if (petitionExists.length == 0) {
            res.status(404).send();
            return;
        }

        const haveSigned = await Signatures.alreadySigned([userId, id]);
        if (haveSigned.length == 0) {
            res.statusMessage =  ("didn't sign this petition");
            res.status(403).send();
            return;
        }


        let isAuthor = await Petitions.authenticate([userId, id]);
        if (isAuthor.length != 0) {
            res.statusMessage =  ("Author cannot unsign their own petition");
            res.status(403).send();
            return;
        }

        let now = new Date();
        let closingDate = await Petitions.checkClosingDate(id);
        closingDate = closingDate[0].closing_date;
        if (new Date(closingDate) < new Date()) {
            res.statusMessage =  ("DATE TOO LATE");
            res.status(403).send();
            return;
        }

        await Signatures.unsign([userId, id]);
        res.status(200).send();
        return;
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};


const Photo = require('../models/petitions.photo.server.model');
const Petition = require('../models/petitions.server.model');
const User = require('../models/user.server.model');
const fs = require('mz/fs');
const path = require('path');
let photosDirectory = '././storage/photos/';

exports.read = async function(req, res){
    try {
        const id = req.params.id;

        let inDB = await Petition.idInDB(id);
        if (inDB.length === 0) {
            res.status(404).send();
            return;
        }

        let photo = await Photo.getOne(id);
        if (photo.length === 0) {
            res.status(404).send();
            return;
        }
        photo = photo[0].photo_filename;
        if (!(await fs.exists(photosDirectory + photo))) {
            res.status(404).send();
            return;
        }
        res.status(200).sendfile(photosDirectory + photo);
        return;
    } catch (err) {
        res.status(500)
            .send(`${ err }`);
    }
};

exports.upload = async function(req, res){
    try {
        let auth_token = req.headers['x-authorization'];
        let contentType = req.headers['content-type'];
        let id = req.params.id;

        const userId = await User.isLoggedOn(auth_token);
        if (userId.length == 0) {
            res.statusMessage = "User is not logged in";
            res.status(401).send();
            return;
        }
        let inDB = await Petition.idInDB(id);
        if (inDB.length === 0) {
            res.status(404).send();
            return;
        }
        let petitionsAuthored = await Petition.authenticate([userId[0].user_id, id]);
        if (petitionsAuthored.length == 0) {
            res.statusMessage =("NOT AUTH");
            res.status(403).send();
            return;
        }


        if (!(contentType == 'image/png' || contentType == 'image/jpeg' || contentType == 'image/gif')){
            res.statusMessage = "Header does not contain content type";
            res.status(400).send();
            return;
        }

        let statusCode;
        let photo = await Photo.getOne(id);
        if (photo[0].photo_filename == null) {
            statusCode = 201;
        } else {
            statusCode = 200;
        }

        let photoFileName = 'petition_' + id + '.' + contentType.slice(6);
        await fs.writeFile(photosDirectory + photoFileName, req.body);


        await Photo.addPhoto([photoFileName, id]);

        res.status(statusCode).send();
        return;
    } catch (err) {
        res.status(500)
            .send(`${ err }`);
    }
};
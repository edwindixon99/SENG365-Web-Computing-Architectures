const User = require('../models/user.server.model');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.read = async function(req, res){
    try {
        let auth_token = req.headers['x-authorization'];
        const id = req.params.id;
        const authedUser = await User.authoriseAccess([auth_token, req.params.id]);     // checks someone is logged in
        const result = await User.getOne([id]);
        if (result.length === 0) {
            res.status(404).send();
            return;
        }
        let final = {"name": result[0].name, "city": result[0].city, "country": result[0].country};
        if (!(authedUser.length === 0)) {
            const email = await User.getAOne(id);
            final["email"] = email[0].email;
        }
        res.status(200).send(final);
        return;

    } catch (err) {
        res.status(500)
            .send();
    }
};

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

exports.create = async function(req, res){
    try {
        let email = req.body.email, password = req.body.password, name = req.body.name;
       if (email === undefined || password === undefined || name === undefined) {
           res.statusMessage =  ("BAD REQUEST");
           res.status(400).send();
           return;
        }
        if (email.length === 0 || password.length === 0 || name.length === 0) {
            res.statusMessage =  ("mandatory fields incomplete");
            res.status(400).send();
            return;
        }
        if (!validateEmail(req.body.email)) {
            res.statusMessage =  ("invalid email");
            res.status(400).send();
            return;
        }
        const uniqueEmail = await User.checkEmail([email]);
        if (uniqueEmail.length !== 0) {
            res.statusMessage =  ("email already taken");
            res.status(400).send();
            return;
        }

        if (req.body.city !== undefined) {
            if (req.body.city.length === 0) {
                res.statusMessage = "City field too short";
                res.status(400).send();
                return;
            }
        }

        if (req.body.country !== undefined) {
            if (req.body.country.length === 0) {
                res.statusMessage = "Country field too short";
                res.status(400).send();
                return;
            }
        }

        const result = await User.insert(req);
        res.status(201).send({"userId":result[0].insertId});
        return;
    } catch (err) {
        res.status(500)
            .send(`ERROR reading user: ${ err }`);
    }
};

exports.logIn = async function(req, res){
    try {
        let email = req.body.email, password = req.body.password;
        email = await User.checkEmail(email);
        if (email.length === 0) {
            res.statusMessage = "Invalid email";
            res.status(400).send();
            return;
        }

        email = email[0].email;
        let hashedPassword = await User.checkHashedPassword(email);
        hashedPassword= hashedPassword[0].password;
        if (!(await bcrypt.compare(password, hashedPassword))) {
            res.statusMessage =  ("Invalid password");
            res.status(400).send();
            return;
        }

        let token = crypto.randomBytes(16).toString('hex');
        let uniqueToken = await User.checkToken(token);
        while (uniqueToken.length !== 0) {
            token = crypto.randomBytes(16).toString('hex');
            uniqueToken = await User.checkToken(token);
        }
        await User.login([token, req.body.email]);
        const authDetails = await User.authenticate2(email);
        res.status(200).send({"userId":authDetails[0].user_id, "token":authDetails[0].auth_token});
        return;
    } catch (err) {
        res.status(500).send(`ERROR reading user: ${ err }`);
        return;
    }
};

exports.logOut = async function(req, res){
    try {
        let auth_token = req.headers['x-authorization'];
        const result1 = await User.isLoggedOn(auth_token);     // checks someone is logged in
        if (result1.length === 0) {
            res.status(401).send();
            return;
        } else {
            const result2 = await User.removeAuth(result1[0].user_id);  // removes users auth_token
            res.status(200).send();
            return;
        }
    } catch (err) {
        res.status(500).send(`ERROR reading user: ${ err }`);
        return;
    }
};

exports.change = async function(req, res){
    try {
        if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
            res.status(400).send();
            return;
        }
        let auth_token = req.headers['x-authorization'];
        const id = req.params.id, name = req.body.name, email = req.body.email, password = req.body.password,
            currentPassword = req.body.currentPassword,
            city = req.body.city, country = req.body.country;
        let body = [name, city, country];
        let newDetails = [];

        const loggedIn = await User.isLoggedOn(auth_token);
        if (loggedIn.length == 0) {                                                               // CHECK WHETHER IT IS 401 or 403
            res.statusMessage = "User not logged in";                     // CHECK WHETHER IT IS 401 or 403
            res.status(401).send();                                                                    // CHECK WHETHER IT IS 401 or 403
            return;
        }


        const authedUser = await User.authoriseAccess([auth_token, req.params.id]);
        if (authedUser.length == 0) {                                                               // CHECK WHETHER IT IS 401 or 403
            res.statusMessage = "User does not have permission to change this";                     // CHECK WHETHER IT IS 401 or 403
            res.status(403).send();                                                                    // CHECK WHETHER IT IS 401 or 403
            return;
        }


        let inDB = await User.idInDB(id);
        if (inDB.length === 0) {
            res.status(404).send();
            return;
        }

        if (name == undefined && city == undefined && country == undefined && email == undefined && password == undefined && currentPassword == undefined){
            res.statusMessage = ("Bad request no valid body inputs supplied");
            res.status(400).send();
            return;
        }

        for (let i=0; i<3; i++) {
            if (body[i] != undefined) {
                if (typeof(body[i]) != "string") {
                    res.statusMessage = "Body input missing values";
                    res.status(400).send();
                    return;
                }
                if (body[i].length == 0) {
                    res.statusMessage = "Body input too short";
                    res.status(400).send();
                    return;
                } else {
                    newDetails.push(body[i]);
                }
            } else {
                newDetails.push(null);
            }
        }

        //email
        if (email != undefined) {
            if (typeof(body[i]) != "string") {
                res.statusMessage = "Email must be type string";
                res.status(400).send();
                return;
            }
            if (!validateEmail(email)) {
                res.statusMessage = "Invalid email";
                res.status(400).send();
                return;
            }
            const uniqueEmail = await User.checkEmail([email]);
            if (uniqueEmail.length != 0) {
                res.statusMessage = "Email already taken";
                res.status(403).send();
                return;
            } else {
                newDetails.push(email);
            }
        } else {
            newDetails.push(null);
        }


        //newpassword
        if (password != undefined) {
            if (password.length == 0) {
                res.statusMessage = "Password too short";
                res.status(400).send();
                return;
            }
            if (currentPassword != undefined){
                let correctPassword = await User.checkHashedPasswordwId(id);
                correctPassword = correctPassword[0].password;
                if (!(await bcrypt.compare(currentPassword, correctPassword))) {
                    res.statusMessage = "Password incorrect";
                    res.status(400).send();
                    return;
                }
            } else {
                res.statusMessage = "Password Required";
                res.status(400).send();
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            newDetails.push(hashedPassword);
        } else {
            newDetails.push(null);
        }
        newDetails.push(id);
        const result = User.update(newDetails);

        res.status(200).send();
        return;

    } catch (err) {
        res.status(500)
            .send(`ERROR reading user: ${ err }`);
    }
};


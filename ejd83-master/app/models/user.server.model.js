const db = require('../../config/db');
const bcrypt = require('bcryptjs');

exports.insert = async function(req) {
    const conn = await db.getPool().getConnection();

    let details = [req.body.name, req.body.email]
    let extraCols = "";
    let values = "";

    //hashing password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    details.push(hashedPassword);

    if (!(req.body.city == undefined)) {
        extraCols += ', city';
        values += ',(?)';
        details.push(req.body.city);
    }
    if (!(req.body.country == undefined)) {
        extraCols += ', country';
        values += ',(?)';
        details.push(req.body.country);
    }
    let queries = `insert into User (name, email, password ${extraCols}) values ((?),(?),(?)${values})`
    const result = await conn.query(queries, details);
    conn.release();
    return result;
};

exports.checkToken = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select auth_token from User where auth_token= ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};


exports.authenticate2 = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select user_id, auth_token from User where email= ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};
exports.login = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'update User set auth_token = ? where email = ?';
    await conn.query(q, details);
    conn.release();
    return;
};

exports.isLoggedOn = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select user_id from User where auth_token = ?';
    const [result] = await conn.query(q, [details]);
    conn.release();
    return result;
};

exports.removeAuth = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'update User set auth_token = NULL';
    await conn.query(q, [details]);
    conn.release();
    return;
};
exports.authoriseAccess = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select user_id from User where auth_token = ? and user_id = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};

exports.getOne = async function(id) {
    const conn = await db.getPool().getConnection();
    let q = 'select name, city, country from User where user_id = ?';
    const [result] = await conn.query(q, id);
    conn.release();
    return result;
};
exports.getAOne = async function(id) {
    const conn = await db.getPool().getConnection();
    let q = 'select email from User where user_id = ?';
    const [result] = await conn.query(q, id);
    conn.release();
    return result;
};
exports.checkEmail = async function(details) {
    const conn = await db.getPool().getConnection();
    let q = 'select email from User where email = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};
exports.checkHashedPasswordwId = async function(details) {
    const conn = await db.getPool().getConnection();
    let q = 'select password from User where user_id = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};

exports.checkHashedPassword = async function(details) {
    const conn = await db.getPool().getConnection();
    let q = 'select password from User where email = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};

exports.update = async function(details) {
    const conn = await db.getPool().getConnection();
    let keys = ['name', 'city','country','email','password'], final = [], first = 0, columns= '', q;

    //name
    for (let i=0;i<5;i++) {
        if (details[i] != null) {
            if (first != 0) {
                columns += ', ';
            }else {
                first = 1;
            }
            columns += `${keys[i]} = '${details[i]}'`;
        }
    }
    q = `update User SET ${columns} where user_id = ?`;
    await conn.query(q, details[5]);
    conn.release();
    return;
};

exports.idInDB = async function(details) {
    const conn = await db.getPool().getConnection();
    let q = 'select user_id from User where user_id = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};

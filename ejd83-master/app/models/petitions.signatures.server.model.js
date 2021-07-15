const db = require('../../config/db');

exports.getAll = async function(id){
    const connection = await db.getPool().getConnection();
    let q = 'select signatory_id , city, country, name, signed_date from Signature inner JOIN User on signatory_id=user_id where petition_id = ? order by signed_date';
    const [rows] = await connection.query(q, id);
    connection.release();
    return rows;
};

/*exports.isLoggedOn = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select user_id from User where auth_token = ?';
    const [result] = await conn.query(q, [details]);
    conn.release();
    return result;
};

exports.checkClosingDate = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select closing_date from Petition where petition_id = ?';
    const [result] = await conn.query(q, [details]);
    conn.release();
    return result;
};

exports.idInDB = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select petition_id from Petition where petition_id = ?';
    const [result] = await conn.query(q, [details]);
    conn.release();
    return result;
};

exports.authenticate = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select petition_id from User u join Petition p on u.user_id=p.author_id where u.user_id = ? and p.petition_id = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};*/

exports.alreadySigned = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select * from Signature where signatory_id=? and petition_id=?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};
exports.sign = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'INSERT INTO `Signature`(`signatory_id`, `petition_id`, `signed_date`) VALUES (?, ?, ?)';
    await conn.query(q, details);
    conn.release();
    return
};
/*exports.authenticate  = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select user_id from User where auth_token = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return result;
};*/
exports.unsign = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'DELETE FROM `Signature` WHERE signatory_id = ? and petition_id = ?';
    await conn.query(q, details);
    conn.release();
    return
};

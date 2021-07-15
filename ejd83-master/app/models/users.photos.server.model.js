const db = require('../../config/db');

exports.getOne = async function(id) {
    const conn = await db.getPool().getConnection();
    const q = "select photo_filename from User where user_id = ?";
    const [rows] = await conn.query(q, id);
    conn.release();
    return rows;
};

exports.addPhoto = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = "UPDATE `User` SET `photo_filename`= ? WHERE user_id = ?";
    await conn.query(q, details);
    conn.release();
    return;
};

exports.remove = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = "UPDATE `User` SET `photo_filename`= null where user_id=?";
    await conn.query(q, details);
    conn.release();
    return;
};
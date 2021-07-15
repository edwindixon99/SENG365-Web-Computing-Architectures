const db = require('../../config/db');

exports.getOne = async function(id) {
    const conn = await db.getPool().getConnection();
    const q = "select photo_filename from Petition where petition_id = ?";
    const [rows] = await conn.query(q, id);
    conn.release();
    return rows;
};

exports.addPhoto = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = "UPDATE `Petition` SET `photo_filename`= ? WHERE petition_id = ?";
    await conn.query(q, details);
    conn.release();
    return;
};

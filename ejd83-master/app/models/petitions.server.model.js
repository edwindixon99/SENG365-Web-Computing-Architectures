const db = require('../../config/db');

exports.getAll = async function(params){
    console.log("connecting....");
    const connection = await db.getPool().getConnection();
    console.log("connection worked");
    const sortBy = params[5];
    let whereStatement = 'where indexNo > ?', queryparams = [], orderq;
    let sortByQueries = ['ALPHABETICAL_ASC', 'ALPHABETICAL_DESC', 'SIGNATURES_ASC', 'SIGNATURES_DESC'];
    if (sortBy === sortByQueries[0]) {
        orderq = ' ORDER BY title ASC';
    } else if (sortBy === sortByQueries[1]) {
        orderq = ' ORDER BY title DESC';
    } else if (sortBy === sortByQueries[2]) {
        orderq = ' ORDER BY count ASC';
    } else if (sortBy === sortByQueries[3]) {
        orderq = ' ORDER BY count DESC';
    } else {
        orderq = ' ORDER BY count DESC';
    }

    //startIndex
    queryparams.push(params[0]);

    // q
    if (params[2] != null) {
        whereStatement += ' AND title LIKE (?)';
        queryparams.push(params[2]);
    }

    //categoryId
    if (params[3] != null) {
        whereStatement += ' AND category_id = ?';
        queryparams.push(params[3]);
    }

    //authorId
    if (params[4] != null) {
        whereStatement += ' AND author_id = ?';
        queryparams.push(params[4]);
    }

    // SortBy
    whereStatement += orderq;

    //count
    if (params[1] != null) {
        whereStatement += ' limit ?';
        queryparams.push(params[1]);
    }

    let q = 'select petition_id, title, category_id, c_name, name as authorname, count, i.indexNo from\n' +
        `       ((select p.petition_id, p.title, c.category_id, c.name as c_name, p.author_id , u.name, s.count, (ROW_NUMBER() over(${orderq})) as indexNo from\n` +
        '        (select p.petition_id, count(s.signatory_id) as count from Petition p left join Signature s on p.petition_id=s.petition_id group by p.petition_id) as s Join Petition p on p.petition_id= s.petition_id INNER \n' +
        '        JOIN Category c on c.category_id=p.category_id INNER JOIN User u on u.user_id=p.author_id) as i)' +
        `${whereStatement}`;

    const [rows] = await connection.query(q, queryparams);
    connection.release();
    return rows;
};

exports.getSignatureCount = async function(){
    const connection = await db.getPool().getConnection();
    let q = 'select name, category_id from Category';
    const [rows] = await connection.query(q);
    connection.release();
    return rows;
};

exports.getOne = async function(id){
    const connection = await db.getPool().getConnection();
    let q = 'select p.petition_id, p.title, c.name as category_name, p.description, p.author_id, u.city, u.country, u.name, s.count, p.created_date, p.closing_date from\n' +
        '             (select Petition.petition_id, count(s.signatory_id) as count from Petition  left join Signature s on Petition.petition_id=s.petition_id group by Petition.petition_id) as s join Petition p on p.petition_id=s.petition_id\n' +
        '              Inner Join Category c on c.category_id=p.category_id Inner JOIN User u on u.user_id=p.author_id where p.petition_id = ?';
    const [rows] = await connection.query(q, id);
    connection.release();
    return rows;
};


exports.getCats = async function(){
    const connection = await db.getPool().getConnection();
    let q = 'select name, category_id from Category';
    const [rows] = await connection.query(q);
    connection.release();
    return rows;
};

exports.isLoggedOn = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select user_id from User where auth_token = ?';
    const [result] = await conn.query(q, [details]);
    conn.release();
    return result;
};
exports.checkCat = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'select category_id from Category where category_id = ?';
    const [result] = await conn.query(q, [details]);
    conn.release();
    return result;
};

exports.add = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'insert into Petition (title, description, author_id, category_id, created_date, closing_date) values (?, ?, ?, ?, ?, ?)';
    const [result] = await conn.query(q, details);
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
};

exports.update = async function(details) {
    const conn = await db.getPool().getConnection();

    //title, description, author_id, category_id, created_date, closing_date
    let columns= '';
    let columnNames = ["title", "description", "category_id", "closing_date"];
    let first = 0;
    for (let i=0;i<4;i++) {
        if (details[i] != null) {
            if (first != 0) {
                columns += ', ';
            }else {
                first = 1;
            }
            columns += `${columnNames[i]} = '${details[i]}'`;
        }
    }
    const q = `update Petition SET ${columns} where petition_id = ?`;
    const [result] = await conn.query(q, [details[4]]);
    conn.release();
    return result;
};

exports.remove = async function(details) {
    const conn = await db.getPool().getConnection();
    const q = 'DELETE FROM Petition WHERE petition_id = ?';
    const [result] = await conn.query(q, details);
    conn.release();
    return;
};
//SELECT petition_id, count(*) FROM `Signature` GROUP BY petition_id
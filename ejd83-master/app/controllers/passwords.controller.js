const bcrypt = require('bcryptjs');

exports.hash = async function (password) {
        return hashedPassword = await bcrypt.hash(password, 10);
};

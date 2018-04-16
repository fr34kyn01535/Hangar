'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        userName: DataTypes.STRING,
        apiKey: DataTypes.STRING
    });

    User.associate = function (models) {
        models.User.hasMany(models.Package, { as: 'packages' });
    };

    return User;
};
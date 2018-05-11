'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userName: DataTypes.STRING,
        apiKey: DataTypes.STRING,
        sessionKey: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        gitHubId: DataTypes.INTEGER
    });

    User.associate = function (models) {
        models.User.hasMany(models.Package, { as: 'packages',foreignKey: 'userId' });
    };

    return User;
};
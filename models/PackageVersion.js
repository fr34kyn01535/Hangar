'use strict';
module.exports = (sequelize, DataTypes) => {


    var PackageVersion = sequelize.define('PackageVersion', {
        version: { type: DataTypes.STRING(20), primaryKey: true },
        downloads: DataTypes.INTEGER,
        listed: { type: DataTypes.BOOLEAN, defaultValue: true }
    });

    PackageVersion.associate = function (models) {
        models.Package.hasMany(models.PackageVersion, { as: 'versions' });
    };

    return PackageVersion;
};
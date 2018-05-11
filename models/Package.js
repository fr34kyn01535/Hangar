'use strict';
module.exports = (sequelize, DataTypes) => {

    var Package = sequelize.define('Package', {
        id: { type: DataTypes.STRING(48), primaryKey: true },
        description: DataTypes.TEXT,
        summary: DataTypes.TEXT,
        releaseNotes: DataTypes.TEXT,
        copyright: DataTypes.STRING,
        title: DataTypes.STRING,
        language: DataTypes.STRING,
        verified: DataTypes.BOOLEAN,
        requireLicenseAcceptance: DataTypes.BOOLEAN,
        developmentDependency: DataTypes.BOOLEAN,
        published: DataTypes.DATE,
        projectUrl: DataTypes.STRING,
        iconUrl: DataTypes.STRING,
        licenseUrl: DataTypes.STRING,
        version: { type: DataTypes.STRING(20), primaryKey: true },
        downloads: DataTypes.INTEGER,
        listed: { type: DataTypes.BOOLEAN, defaultValue: true },
        tags: DataTypes.STRING,
        authors: DataTypes.STRING
    });

    return Package;
};
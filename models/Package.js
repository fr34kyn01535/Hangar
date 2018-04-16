'use strict';
module.exports = (sequelize, DataTypes) => {

    var Package = sequelize.define('Package', {
        id: { type: DataTypes.STRING(48), primaryKey: true },
        version: {type:DataTypes.STRING(20)},
        description: DataTypes.TEXT,
        summary: DataTypes.TEXT,
        title: DataTypes.STRING,
        verified: DataTypes.BOOLEAN,
        projectUrl: DataTypes.STRING,
        totalDownloads: DataTypes.INTEGER,
        tags: {
            type: DataTypes.STRING,
            get: function () {
                return this.getDataValue('tags').split(';')
            },
            set: function (val) {
                this.setDataValue('tags', val.join(';'));
            }
        },
        authors: {
            type: DataTypes.STRING,
            get: function () {
                return this.getDataValue('authors').split(';')
            },
            set: function (val) {
                this.setDataValue('authors', val.join(';'));
            }
        }
    });

    Package.associate = function (models) {

    };

    return Package;
};
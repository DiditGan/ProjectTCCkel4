const { DataTypes, Sequelize, Model } = require('sequelize'); // Added Model import

module.exports = (sequelize, DataTypes) => {
  const Barang = sequelize.define('Barang', {
    // ...other attributes...
    date_posted: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    // ...other attributes...
  }, {
    // ...other options...
  });
  return Barang;
};
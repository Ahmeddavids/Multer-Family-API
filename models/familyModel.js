const mongoose = require('mongoose');

const familySchema = new mongoose.Schema( {
  fatherName: {
      type: String,
      require: true
  },
  motherName: {
      type: String,
      required: true
  },
  children: [{
      type: String,
      required: true
  }],
  childrenImage: [{
      type: String,
      required: true
  }]
}, { timestamps: true } );

const Family = mongoose.model('Family', familySchema);

module.exports = Family;

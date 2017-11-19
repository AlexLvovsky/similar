import * as mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  userid: String,
  email: String,
  url: String,
  referrer: String,
  frames: [{
    type: String
  }],
  time: Date
});

const Url = mongoose.model('Url', urlSchema);

export default Url;

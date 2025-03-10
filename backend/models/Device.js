import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    name: {type :String ,required:true},
    ip: {type :String ,required:true},
    mac: {type :String ,required:true},
    status: {type :String ,required:true},
    netId: {type :String ,required:true}
});


const Device = mongoose.model('Device',deviceSchema);

export default Device;
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(
    {
        path:"./config.env"
    }
);


const connectDB=() =>{

    mongoose.connect('mongodb+srv://miniproject07s:G16PObcPYM3KeqYs@network.k0ddo.mongodb.net/?retryWrites=true&w=majority&appName=networkc',{
        dbName:process.env.networkDevices
    }).then(()=>{
        console.log("connected to database");
    }).catch(err=>{
        console.log("some error occured while connecting to database :" ,err)
    })

}


export default connectDB;

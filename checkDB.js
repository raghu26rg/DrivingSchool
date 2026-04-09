import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neha_driving_school';

const checkUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const users = await User.find({}, 'name phone role');
        console.log("ALL USERS IN DATABASE:");
        console.table(users.map(u => ({ name: u.name, phone: u.phone, role: u.role })));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
checkUsers();

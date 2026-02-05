const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserMember = require('./models/UserMember');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await UserMember.findOne({ username: 'ნიკოლოზი' });
        if (user) {
            console.log('User Found:');
            console.log('ID:', user._id);
            console.log('Username:', user.username);
            console.log('Status:', user.status);
            console.log('Role:', user.role);
            console.log('Email:', user.email);
        } else {
            console.log('User "ნიკოლოზი" not found');
            const allUsers = await UserMember.find({}, 'username status');
            console.log('All Users:', allUsers);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUser();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const UserMember = require('./models/UserMember');

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const username = 'ნიკოლოზი';
        const password = 'password123'; // The default I used in my repro_registration

        const user = await UserMember.findOne({ username });
        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User found, status:', user.status);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

testLogin();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserMember = require('./models/UserMember');

dotenv.config();

const inspectUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await UserMember.findOne({ username: 'ნიკოლოზი' });
        if (user) {
            console.log('Username:', user.username);
            console.log('Length:', user.username.length);
            console.log('Hex:', Buffer.from(user.username).toString('hex'));
            console.log('Password Hash:', user.password);
            console.log('Is valid bcrypt hash:', user.password.startsWith('$2'));
        } else {
            console.log('User not found');
            const all = await UserMember.find({});
            all.forEach(u => {
                console.log(`- "${u.username}" (${u.username.length}) [${Buffer.from(u.username).toString('hex')}]`);
            });
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

inspectUser();

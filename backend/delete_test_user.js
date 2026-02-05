const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserMember = require('./models/UserMember');

dotenv.config();

const deleteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await UserMember.deleteMany({
            $or: [
                { username: 'ნიკოლოზი' },
                { email: 'nikolozgugunashvili96@gmail.com' }
            ]
        });

        console.log('Deleted Count:', result.deletedCount);

        // Verify deletion
        const exists = await UserMember.findOne({ username: 'ნიკოლოზი' });
        if (!exists) {
            console.log('Verification: User "ნიკოლოზი" is successfully removed.');
        } else {
            console.log('Warning: User still exists!');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error during deletion:', err);
    }
};

deleteUser();

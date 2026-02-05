const axios = require('axios');

const testRegistration = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/parish/register', {
            username: 'ნიკოლოზი',
            email: 'nikolozgugunashvili96@gmail.com',
            password: 'password123',
            fullName: 'Nikoloz Gugunashvili',
            phoneNumber: '+995577001196'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.log('Error Status:', error.response?.status);
        console.log('Error Data:', error.response?.data);
    }
};

testRegistration();

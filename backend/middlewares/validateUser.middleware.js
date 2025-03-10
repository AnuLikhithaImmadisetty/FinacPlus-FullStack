const { ErrorHandler } = require('./Error.middleware');

const validateInfo = (req, res, next) => {
    const { name, age, dob, password, gender, about } = req.body;

    // Skip password validation for the 'edit-user' endpoint
    if (req.method === 'POST' && req.originalUrl.includes('/add-user/')) {

        if (!name || typeof name !== 'string' || name.length < 2 || /\d/.test(name)) {
            return next(new ErrorHandler('Name must be a string with at least 2 characters and should not contain numbers.', 400));
        }

        if (typeof age !== 'number' || age < 0 || age > 120) {
            return next(new ErrorHandler('Age must be a number between 0 and 120.', 400));
        }

        const dobParts = dob.split('-');
        if (dobParts.length !== 3) {
            return next(new ErrorHandler('Date of Birth must be in the format mm-dd-yyyy.', 400));
        }

        const [month, day, year] = dobParts.map(Number);
        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            return next(new ErrorHandler('Date of Birth contains invalid numbers.', 400));
        }``

        const dobDate = new Date(year, month - 1, day);
        if (dobDate.getMonth() !== month - 1 || dobDate.getDate() !== day || dobDate.getFullYear() !== year) {
            return next(new ErrorHandler('Date of Birth is not a valid date.', 400));
        }

        const today = new Date();
        let calculatedAge = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
            calculatedAge--;
        }

        if (calculatedAge !== age) {
            return next(new ErrorHandler(`The provided age does not match the Date of Birth. CORRECT AGE: ${calculatedAge}`, 400));
        }

        const validGenders = ['Male', 'Female', 'Other'];
        if (!gender || !validGenders.includes(gender)) {
            return next(new ErrorHandler('Gender must be one of the following: Male, Female, Other.', 400));
        }

        if (!about || typeof about !== 'string' || about.length > 5000) {
            return next(new ErrorHandler('About section cannot be empty and must be a string with a maximum of 5000 characters.', 400));
        }

        next();
    } else {
        if (!password || typeof password !== 'string' || password.length < 10 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            return next(new ErrorHandler('Password musst contain atleast 10 characters long both alpha and numeric.', 400));
        }

        if (!name || typeof name !== 'string' || name.length < 2 || /\d/.test(name)) {
            return next(new ErrorHandler('Name must be a string with at least 2 characters and should not contain numbers.', 400));
        }

        if (typeof age !== 'number' || age < 0 || age > 120) {
            return next(new ErrorHandler('Age must be a number between 0 and 120.', 400));
        }

        const dobParts = dob.split('-');
        if (dobParts.length !== 3) {
            return next(new ErrorHandler('Date of Birth must be in the format mm-dd-yyyy.', 400));
        }

        const [month, day, year] = dobParts.map(Number);
        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            return next(new ErrorHandler('Date of Birth contains invalid numbers.', 400));
        }

        const dobDate = new Date(year, month - 1, day);
        if (dobDate.getMonth() !== month - 1 || dobDate.getDate() !== day || dobDate.getFullYear() !== year) {
            return next(new ErrorHandler('Date of Birth is not a valid date.', 400));
        }

        const today = new Date();
        let calculatedAge = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
            calculatedAge--;
        }

        if (calculatedAge !== age) {
            return next(new ErrorHandler('The provided age does not match the Date of Birth.', 400));
        }

        const validGenders = ['Male', 'Female', 'Other'];
        if (!gender || !validGenders.includes(gender)) {
            return next(new ErrorHandler('Gender must be one of the following: Male, Female, Other.', 400));
        }

        if (!about || typeof about !== 'string' || about.length > 5000) {
            return next(new ErrorHandler('About section cannot be empty and must be a string with a maximum of 5000 characters.', 400));
        }

        next();
    }
};

module.exports = validateInfo;
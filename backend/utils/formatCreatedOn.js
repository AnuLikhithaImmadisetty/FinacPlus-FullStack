const formatCreatedOn = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
};

module.exports = formatCreatedOn
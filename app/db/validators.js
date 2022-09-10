module.exports = {
    checkForbidenString(value, forbidenString) {
        if (value === forbidenString) {
            throw new Error('Nazwa "slug" jest zakazana');
        }
    },

    validateEmail(mail) {
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!mail.match(mailformat)) {
            throw new Error("Nazwa emil nieprawidłowy");
        }
    },
};

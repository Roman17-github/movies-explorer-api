const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (v) => isEmail(v),
            message: 'неправильный формат e-mail',
        },
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    name: {
        type: String,
        required:true,
        minlength: 2,
        maxlength: 30,
    },

});

userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email }).select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('InvalidLogin'));
            }
            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        return Promise.reject(new Error('InvalidLogin'));
                    }
                    return user;
                });
        });
};

module.exports = mongoose.model('user', userSchema);
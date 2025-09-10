const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const { refreshToken } = require("../../../helper/token");
const userSchema = mongoose.Schema({
    cin: {
        type: String,
        maxlength: 8,

    },
    firstName: {
        type: String,
        maxlength: 54,
    },
    lastName: {
        type: String,
        maxlength: 54,
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },],
    phone: {
        type: String,
        maxlength: 13,
        required: true,
    },
    dateOfBirth: { type: Date, },
    gender: {
        type: String, // 0 : female, 1: male
        enum: ["0", "1","-1"],
        default: "1",
    },
    email: {
        type: String,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true,
        unique: true,
        maxlength: 60,
    },
    password: {
        type: String,
        minlength: 8,
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: "5f52b95954874800009a692c", // Role User
    },
    verified: {
        email: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: Boolean,
            default: false,
        },
    },
    auth: {
        token: {
            type: String,
            default: "",
        },
        expireAt: {
            type: Date,
            default: new Date(),
        },
    },
    tokenFCM: {
        type: String,
        default: "",
    },
    language: { type: String, enum: ["fr", "en", "ar"], default: "fr", required: true },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true },);
userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function (next) {
    if (this._isNewUser) {
        if (this.password)
            this.password = await this.encryptPassword(this.password);
        const currentTime = new Date();
        const futureTime = new Date(currentTime.getTime() + 15 * 60 * 1000); // Add 15 min in milliseconds
        this.auth = {
            token: await refreshToken({ id: this._id }),
            expireAt: futureTime,
        };
    }
    next();
});
userSchema.pre(/^find/, function (next) {
    if (!this.getFilter().includeDeleted) {
        this.where({ isDeleted: false });
    }
    next();
});
userSchema.methods.encryptPassword = async (password) => {
    // mehode for crypt password
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
//methode compare tow password if exated return true else return false
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.refreshToken = async function () {
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days in milliseconds
    this.auth = {
        token: await refreshToken({ id: this._id }),
        expireAt: futureTime,
    };
    return await this.save();
};
userSchema.index({ "auth.token": 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    userSchema
};
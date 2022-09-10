const Users = require("../db/models/user");
const jwt = require("jsonwebtoken");
const config = require("../config");

class UserController {

    async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Users.findOne({ email: email });
        const { browser, version, os } = req.useragent;
        const device = os + " / " + browser + " " + version;

        try {
            if (!user) {
                throw new Error("User not found");
            }
            const isValidPassword = user.comparePassword(password);
            if (!isValidPassword) {
                throw new Error("Password not valid");
            }

            let payload = {
                id: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
            };

            payload.token = jwt.sign(payload, config.accessToken, {
                expiresIn: "15m",
            });
            payload.refreshToken = jwt.sign(payload, config.refreshToken);

            const refreshToken = {
                token: payload.refreshToken,
                user_id: payload.id,
                device,
            };

            user.refreshToken.push(refreshToken);
            user.save();

            res.status(200).json(payload);
        } catch (e) {
            res.status(401).json({ errors: e.errors });
        }
    }

    async logout(req, res) {
        const refreshToken = req.body.refreshToken;
        try {
            let user = await Users.findOne({ "refreshToken.token": refreshToken });

            user.refreshToken = user.refreshToken.filter(i => i.token != refreshToken);
            user.save();
            res.sendStatus(204);
        } catch (e) {
            res.status(401).json({ error: e.errors });
        }
    }

    async refresh(req, res) {
        const refreshToken = req.body.refreshToken;

        try {
            const user = await Users.findOne({
                "refreshToken.token": refreshToken
            });
            if (!user) return res.sendStatus(401);

            jwt.verify(refreshToken, config.refreshToken, (err, data) => {
                if (err) return res.sendStatus(401);
                let payload = {
                    id: data._id,
                    email: data.email,
                    name: data.name,
                    isAdmin: data.isAdmin,
                };

                payload.token = jwt.sign(payload, config.accessToken, {
                    expiresIn: "15m",
                });

                res.status(200).json(payload);
            });
        } catch (e) {
            res.sendStatus(401);
        }
    }

    async register(req, res) {
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        try {
            await user.save();
            res.sendStatus(201);
        } catch (e) {
            res.sendStatus(401);
        }
    }

    async edit(req, res) {
        const { id } = req.params;
        const user = await Users.findById(id);
        const { name, email, isAdmin } = req.body;
        try {
            if (name) user.name = name;
            if (email) user.email = email;
            if (isAdmin) user.isAdmin = isAdmin;

            await user.save();
            res.status(200).json({
                message: "Dane zostały zmienione",
            });
        } catch (e) {
            res.status(400).json({ message: "Dane niezostały zmienione" });
        }
    }

    async changePassword(req, res) {
        const { id } = req.params;

        try {
            const user = await Users.findById(id);
            const isValidPassword = user.comparePassword(req.body.password);
            if (!isValidPassword) {
                throw new Error("Password not valid");
            }
            user.password = req.body.newpassword;

            await user.save();
            res.status(200).json({ message: "Hasło zostało zmienione" });
        } catch (e) {
            res.status(400).json({ message: "Hasło niezostało zmienione" });
        }
    }

    async getAll(req, res) {
        try {
            const users = await Users.find({}).select("name email");
            res.status(200).json(users);
        } catch (e) {
            res.sendStatus(401);
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            await Users.findByIdAndDelete(id);
            res.status(204).json({ message: "Usunięto" });
        } catch (e) {
            res.sendStatus(401);
        }
    }
}

module.exports = new UserController();

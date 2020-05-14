import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { APP_KEY, SALT_ROUNDS } from '../env';
import Users, { checkExisting } from './../models/usersModel';
import { ErrorHandler } from '../middlewares';

const authController = {
    login: async (req, res) => {
        const { username, password, reserved } = req.body;

        if (!reserved && username) {
            const check = await checkExisting(username);
            if (check) {
                throw new ErrorHandler(
                    401,
                    'Username is already in use. Try another username or provide valid password!'
                );
            }

            const token = jwt.sign({ username: user.username, reserved: false }, APP_KEY);
            return res.json({ success: true, token });
        }

        const match = await bcrypt.compare(password, user.password);
        const user = await Users.findOne({ username });

        if (user && match) {
            const token = jwt.sign({ username: user.username }, APP_KEY);
            return res.json({ success: true, token });
        }

        throw new ErrorHandler(401, 'Username or password is incorrect. Try again!');
    },

    register: async (req, res) => {
        if (!req.body) {
            throw new ErrorHandler(401, 'Invalid Request');
        }

        const { username, password } = req.body;
        const check = await checkExisting(username);

        if (check) {
            throw new ErrorHandler(401, 'Username already exists. Try another one!');
        }

        const hash = bcrypt.hashSync(password, SALT_ROUNDS);
        const newUser = new Users({ username, password: hash });

        await newUser.save();

        return res.json({
            success: true,
            message: 'Successfully registered'
        });
    }
};

export default authController;

const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).send({ message: "User already registered" });

    const { firstName, lastName, email, password } = req.body;
    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      username: Math.random().toString(),
    });

    _user.save((error, data) => {
      console.log(error);
      if (error) {
        return res.status(400).send({
          message: "Something wrong",
        });
      }

      if (data) {
        return res.status(200).send({
          message: "User created successfully",
          user: data,
        });
      }
    });
  });
};

exports.signin = (req, res, next) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return req.status(400).send({ error: error });
    if (user) {
      if (user.authenticate(req.body.password)) {
        //authenticate didapat dari model user

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const { _id, firstName, lastName, email, role, fullName } = user;

        res.status(200).send({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).send({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).send({
        message: "Something went wrong",
      });
    }
  });
};

exports.requireSignIn = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // ambil headers element ke 1 (isinya kan Bearer <isi token>, itu di split (" ") jadi dua elemen lalu diaambil elemen ke 1 (yaitu isi token))

  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
  // jwt.decode()
};

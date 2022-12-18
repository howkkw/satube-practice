import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password is not match",
    });
  }
  const bothExists = await User.exists({ $and: [{ username }, { email }] });
  const userExists = await User.exists({ username });
  const emailExists = await User.exists({ email });
  if (bothExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "username & email are already taken",
    });
  } else if (userExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Username is already taken",
    });
  } else if (emailExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Email is already taken",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
    });
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error._message });
  }
  return res.redirect("/login");
};
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Username is not exists.",
    });
  }
  const ok = bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

export const startLoginGithub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize?";
  const config = {
    client_id: process.env.CLIENT_ID,
    allow_signup: false,
    scope: "user:email read:user",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishLoginGithub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
};

export const getEdit = (req, res) => {
  res.send("Edit");
};
export const postEdit = (req, res) => {
  res.send("Edit");
};
export const logout = (req, res) => {
  res.send("loasas");
};

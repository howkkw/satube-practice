import User from "../model/User.js";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import Video from "../model/Video.js";

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
  const user = await User.findOne({ username, socialOnly: false });
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
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.CLIENT_ID,
    allow_signup: false,
    scope: "user:email read:user",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishLoginGithub = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, username, email },
    file,
  } = req;
  console.log(file);
  const alreadyUser = await User.findById(_id);
  if (alreadyUser.username === username && alreadyUser.email === email) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "This Email/Username are already token",
    });
  } else if (alreadyUser.username === username && alreadyUser.email !== email) {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        username,
        avatarUrl: file ? file.path : avatarUrl,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
  } else if (alreadyUser.username !== username && alreadyUser.email === email) {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        username,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const logout = (req, res) => {
  req.session.user = null;
  req.session.loggedIn = false;
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "can't change password");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change-password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change-password",
      errorMessage: "The existing password is not valid.",
    });
  }
  if (oldPassword === newPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change-password",
      errorMessage: "The password is the same as the existing password.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change-password",
      errorMessage: "The new password does not match the confirmation.",
    });
  }
  user.password = newPassword;
  await user.save();
  req.session.destroy();
  req.flash("info", "Password updated");
  return res.redirect("/users/logout");
};

export const myProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(400).render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};

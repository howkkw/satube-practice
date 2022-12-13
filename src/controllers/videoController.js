import Video from "../model/Video.js";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home" });
};
export const search = (req, res) => {
  return res.send("앗!");
};

export const watch = (req, res) => {
  return res.send("watch");
};
export const edit = (req, res) => {
  return res.send("edit");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
  } = req;
  console.log(title, description, hashtags);
  try {
    const video = await Video.create({
      title,
      description,
      hashtags: hashtags
        .split(",")
        .map((word) => (startWith("#") ? word : `#${word}`)),
      createdAt: "dsfd",
      meta: {
        views: 0,
      },
    });
    console.log(video);
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

export const videoDelete = (req, res) => {
  return res.send("삭제");
};

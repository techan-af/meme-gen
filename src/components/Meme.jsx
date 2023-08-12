import React from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import Draggable from "react-draggable";

export default function Meme() {
  const [meme, setMeme] = React.useState({
    topText: "",
    bottomText: "",
    randomImage: "http://i.imgflip.com/28j0te.jpg",
  });
  const [allMemes, setAllMemes] = React.useState([]);

  React.useEffect(() => {
    async function getMemes() {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();
      setAllMemes(data.data.memes);
    }
    getMemes();
  }, []);

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      randomImage: url,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

  function clearInput() {
    setMeme((prevMeme) => ({
      ...prevMeme,
      topText: "",
      bottomText: "",
    }));
  }

  const node = document.getElementById("meme-img");
  function downloadImage() {
    toPng(node)
      .then((dataURL) => {
        download(dataURL, "meme.png");
      })
      .catch(() => console.log("error occured"));
  }

  return (
    <main>
      <div className="form">
        <input
          type="text"
          name="topText"
          placeholder="top text"
          className="form--input"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bottomText"
          placeholder="bottom text"
          className="form--input"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button className="form--button" onClick={getMemeImage}>
          Get a new meme image 🖼
        </button>
        <button className="form--button" onClick={clearInput}>
          Clear Text
        </button>
      </div>
      <div className="meme" id="meme-img">
        <img
          src={meme.randomImage}
          alt="suppose its a meme image"
          className="meme--image"
        />
        <Draggable bounds="parent">
          <h2 className="meme--text top">{meme.topText}</h2>
        </Draggable>
        <Draggable bounds="parent">
          <h2 className="meme--text bottom">{meme.bottomText}</h2>
        </Draggable>
      </div>
      <div className="download--section">
        <button className="download--button" onClick={downloadImage}>
          Download Meme ⇩
        </button>
      </div>
    </main>
  );
}

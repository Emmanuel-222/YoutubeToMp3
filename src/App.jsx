import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";
import axios from "axios";
import "./App.css";
import { youtube_parser } from "./utils/YoutubeParser";

const App = () => {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState(false);
  const youtubeId = youtube_parser(input);

  const handleClick = () => {
    if (!youtubeId) {
      alert("Invalid link");
      setInput("");
      setUrl("")
      return;
    }

    const options = {
      method: "GET",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      params: { id: youtubeId },
      headers: {
        "x-rapidapi-key": "dda18eba4cmshd12a9a021f816bfp1fcbddjsn4880a40ad4d2",
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    };
    setLoader(true);

    axios(options)
      .then((response) => {
        setUrl(response.data.link); // Save the MP3 download link
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoader(false); // Stop loader after the request is done
      });
    console.log(youtubeId);
  };

  const handleDownloadClick = () => {
    // Clear the input field when the download link is clicked
    setInput(""); // Clear the input value

    setUrl(""); // Optionally clear the URL if you want to reset the state
  };

  return (
    <div className="App h-[100vh] flex flex-col justify-center items-center font-montserrat gap-8">
      <h1 className="text-center font-bold text-2xl md:text-4xl">
        Welcome to YoutubeToMp3
      </h1>
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="font-bold text-xl">Convert here</h1>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Enter YouTube URL"
          className="w-[20rem] md:w-[30rem] text-black p-[10px] border-none outline-none"
        />
        {input ? (
          <button onClick={handleClick} className="btn">
            Convert
          </button>
        ) : null}

        {/* Loader displayed while the request is ongoing */}
        {loader ? (
          <button
            type="button"
            className="bg-indigo-500 text-white font-bold py-2 px-4 rounded flex items-center"
            disabled
          >
            <svg
              className="animate-spin h-5 w-5 text-white mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing...
          </button>
        ) : (
          // If URL is available, show the download link
          url && (
            <div className="mt-4">
              <a
                onClick={handleDownloadClick}
                href={url}
                className="text-blue-500 underline"
                target="_blank"
                rel="noreferrer"
                download
              >
                Download MP3
              </a>
            </div>
          )
        )}
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
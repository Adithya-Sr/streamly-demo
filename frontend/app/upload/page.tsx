"use client";
import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const videoRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userJson = localStorage.getItem("user");
    if (!userJson) {
      alert("Can't Upload File:Unauthorized User");
      router.push("/");
      return;
    }
    const user = JSON.parse(userJson);
    const file = videoRef.current?.files?.[0];
    if (!file) {
      alert("Please select a video file.");
      return;
    }

    const videoData = new FormData();
    videoData.append("file", file);
    videoData.append("upload_preset", "streamly");

    try {
      console.log(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/video/upload`
      );
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/video/upload`,
        { method: "POST", body: videoData }
      );
      if (!cloudRes.ok) {
        throw new Error(`${cloudRes.status}:${cloudRes.statusText}`);
      }
      const jsonRes = await cloudRes.json();
      console.log(jsonRes);
      const videoUrl = jsonRes.url;

      const res = await fetch(
        "https://streamly-demo.onrender.com/api/v1/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            visibility,
            url: videoUrl,
            userId: user.id,
          }),
        }
      );

      if (res.ok) {
        alert("Uploaded successfully!");
        router.push("/feed");
        setTitle("");
        setDescription("");
        setVisibility("");
        videoRef.current = null;
      } else {
        throw new Error(`${cloudRes.status}:${cloudRes.statusText}`);
      }
    } catch (error: any) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  return (
    <section className="flex flex-col items-center">
      <button
        className="mt-[1rem] text-[1.5rem] border rounded-[10px]  w-[20rem] ml-[3.5rem]"
        onClick={() => {
          router.push("/feed");
        }}
      >
        Go Back
      </button>
      <h1 className="mt-[3rem] text-[1.5rem]">Upload Video</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[1rem] mt-[3rem] border rounded-[10px] p-[1rem] h-[35rem] w-[30rem]"
      >
        <div className="flex flex-col gap-[7px]">
          <label className="text-[1.2rem] font-semibold">Title:</label>
          <input
            type="text"
            className="border rounded-[10px] w-[15rem] h-[1rem] p-[1rem] text-[1.2rem]"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
          />
        </div>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[1.2rem] font-semibold">Description:</label>
          <textarea
            className="border rounded-[10px] w-[25rem] h-[6rem] p-[1rem] text-[1.2rem]"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            required
          />
        </div>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[1.2rem] font-semibold">Visibility:</label>
          <select
            className="border rounded-[10px] w-[15rem] h-[3rem] p-[1px] text-[1.2rem]"
            value={visibility}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setVisibility(e.target.value)
            }
            required
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[1.2rem] font-semibold">Video:</label>
          <input
            type="file"
            accept="video/*"
            ref={videoRef}
            required
            className="border rounded-[10px] w-[15rem] h-[3rem] p-[1rem] "
          />
        </div>
        <button
          type="submit"
          className="mt-[2rem] text-[1.5rem] border rounded-[10px] bg-black text-white w-[20rem] ml-[3.5rem]"
        >
          Upload
        </button>
      </form>
    </section>
  );
};

export default Upload;

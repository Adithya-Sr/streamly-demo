"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Video {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  userId: string;
  uploadedAt: string;
}
const getUserProfile = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`${res.status}:${res.statusText}`);
    }
    const data = await res.json();
    const userData: User = data.message;
    console.log(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (e: any) {
    throw e;
  }
};

const getVideoFeed = async () => {
  try {
    const res = await fetch(
      //used sample pagination values for demonstration
      "http://localhost:8000/api/v1/videos?page=1&limit=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error(`${res.status}:${res.statusText}`);
    }
    const feedData = await res.json();
    const feed: Video[] = feedData.message;
    return feed;
  } catch (e: any) {
    throw e;
  }
};

const Feed = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [videoFeed, setVideoFeed] = useState<Video[] | undefined>(undefined);
  const router = useRouter();
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        const feed = await getVideoFeed();
        setVideoFeed(feed);
      } catch (e: any) {
        console.log(e);
        alert("Error Loading Feed...");
        router.push("/");
      }
    }
    loadUser();
  }, []);
  return (
    <section className="flex flex-col gap-[2rem] mt-[10px] ">
      <nav className="flex items-center border-b border-gray-500 w-[100%] pb-[1rem]">
        {user ? (
          <div>
            <h2 className="text-[1.5rem] ml-[35rem]">
              Welcome <span className="font-bold">{user.name}</span>
            </h2>
          </div>
        ) : (
          <h1>Loading Profile...</h1>
        )}
        <button
          onClick={() => {
            router.push("/upload");
          }}
          className="border rounded-[10px] text-[1.2rem] pl-[1rem] pr-[1rem] ml-[35rem] "
        >
          Upload Videos
        </button>
      </nav>
      <section>
        <h1 className="text-[1.5rem] font-semibold ml-[40rem] ">Feed</h1>
        <div className="mt-[2rem]">
          {!videoFeed || videoFeed.length === 0 ? (
            <h2 className="text-[1.5rem] font-semibold">
              No Videos In Feed...
            </h2>
          ) : (
            <div className="flex gap-[1rem] ml-[3rem]">
              {videoFeed.map((video) => {
                return (
                  <div
                    key={video.videoId}
                    className="flex flex-col gap-[1rem] items-center border rounded-[10px] p-[1rem]"
                  >
                    <h1>
                      Title:{" "}
                      <span className="ml-[10px] font-bold">
                        {video.videoTitle}
                      </span>
                    </h1>
                    <h3>
                      Uploaded On:
                      <span className="ml-[10px] font-bold">
                        {video.uploadedAt.split("T")[0]}
                        <span className="ml-[5px] mr-[5px]">at</span>
                        {video.uploadedAt.split("T")[1].split(".")[0]}
                      </span>
                    </h3>
                    <video controls width="480">
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default Feed;

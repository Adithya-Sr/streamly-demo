"use client";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
const Home = () => {
  return (
    <section>
      <h1 className="text-[3rem] font-bold text-red-600 text-center mt-[1rem]">
        STRMLY
      </h1>

      <div className="flex gap-[2rem] ml-[20rem] mt-[2rem]">
        <div className="flex flex-col items-center">
          <h2 className="text-[1.5rem] ">Create Account</h2>
          <Signup></Signup>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-[1.5rem] ">Login To An Existing Account</h2>
          <Login></Login>
        </div>
      </div>
    </section>
  );
};

export default Home;

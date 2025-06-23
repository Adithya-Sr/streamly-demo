"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let res = await fetch("http://localhost:8000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, retypePassword }),
      });
      if (!res.ok) {
        throw new Error(`${res.status}:${res.statusText}`);
      }

      res = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, retypePassword }),
      });
      if (!res.ok) {
        throw new Error(`${res.status}:${res.statusText}`);
      }
      router.push("/feed");
    } catch (e: any) {
      console.log(e);
      alert("Couldn't Signup! Please Try Again");
    }
    //reset states
    setName("");
    setEmail("");
    setPassword("");
    setRetypePassword("");
  };
  return (
    <section className="flex flex-col gap-[1rem] items-center w-[25rem] h-[35rem] p-[1rem] border rounded-2xl">
      <h2 className="text-[2rem]">Create Account</h2>
      <form className="flex flex-col gap-[1rem]" onSubmit={submitHandler}>
        <div>
          <label className="block text-[1.5rem]">Name</label>
          <input
            required
            type="string"
            placeholder="your name"
            className="border rounded-[10px] w-[15rem] h-[3rem] p-[1rem] text-[1.2rem]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </div>
        <div>
          <label className="block text-[1.5rem]">Email</label>
          <input
            required
            type="email"
            placeholder="sample@gmail.com"
            className="border rounded-[10px] w-[15rem] h-[3rem] p-[1rem] text-[1.2rem]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>
        <div>
          <label className="block text-[1.5rem]">Password</label>
          <input
            required
            type="password"
            placeholder="your password"
            className="border rounded-[10px] w-[15rem] h-[3rem] p-[1rem] text-[1.2rem]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>
        <div>
          <label className="block text-[1.5rem]">Retype Password</label>
          <input
            required
            type="password"
            placeholder="retype password"
            className="border rounded-[10px] w-[15rem] h-[3rem] p-[1rem] text-[1.2rem]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setRetypePassword(e.target.value);
            }}
            value={retypePassword}
          />
        </div>
        <button className="mt-[2rem] text-[1.5rem] border rounded-[10px] bg-black text-white">
          Signup
        </button>
      </form>
    </section>
  );
};

export default Signup;

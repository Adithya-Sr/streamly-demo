"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://streamly-demo.onrender.com/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password, retypePassword }),
        }
      );
      if (!res.ok) {
        throw new Error(`${res.status}:${res.statusText}`);
      }
      router.push("/feed");
    } catch (e: any) {
      console.log(e);
      alert("Couldn't Login! Please Try Again");
    }

    setEmail("");
    setPassword("");
    setRetypePassword("");
  };
  return (
    <section className="flex flex-col gap-[1rem] items-center w-[25rem] h-[35rem]  p-[1rem] border rounded-2xl">
      <h2 className="text-[2rem]">Login</h2>
      <form className="flex flex-col gap-[1rem]" onSubmit={submitHandler}>
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
        <button className="mt-[8rem] text-[1.5rem] border rounded-[10px] bg-black text-white">
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;

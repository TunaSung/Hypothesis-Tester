import { useCallback, useState, type ChangeEvent } from "react";
import FloatingField from "./FloatingField";
import { IoPersonOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

type SignInProps = {
  toggleAuthView: () => void;
};

type FormState = {
  email: string;
  password: string;
};

function SignIn({ toggleAuthView }: SignInProps) {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  return (
    <>
      <form className="flex flex-col justify-center gap-6">
        <FloatingField
          icon={IoPersonOutline}
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="email"
          required
        />

        <FloatingField
          icon={TbLockPassword}
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
          minLength={6}
          required
        />

        <button
          type="submit"
          className="border flex self-center rounded-2xl shadow-lg px-6 py-2 font-semibold
          bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 hover:-translate-y-1 transition-all duration-200"
        >
          Sign In
        </button>
      </form>
      <div className="text-sm flex flex-col">
        <button className="text-slate-400 hover:text-red-500 transition-colors duration-200">
          Forget password?
        </button>
        <button
          onClick={toggleAuthView}
          className="text-slate-400 hover:text-blue-500 transition-colors duration-200 mt-2"
        >
          Don’t have an account?
        </button>
      </div>
    </>
  );
}

export default SignIn;

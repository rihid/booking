import { signIn } from "@/auth";
import { authenticate } from "@/lib/actions";

export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        // await signIn("credentials", formData)
        await authenticate(formData)
      }}
    >
      <label>
        Email
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}
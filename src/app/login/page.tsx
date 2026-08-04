import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-center">Platform Login</h1>
        <p className="mb-6 text-sm text-gray-500 text-center">Sign in to your account</p>
        <LoginForm />
      </div>
    </div>
  )
}

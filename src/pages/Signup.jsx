import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.setItem('user', JSON.stringify({ email: formData.email }))
    navigate('/chat')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Signup</h1>
        <p className="mt-2 text-slate-600">Create your TriDosha AI account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            Create Account
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-emerald-700">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Signup

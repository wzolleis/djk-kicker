// app/routes/login.tsx
import { useState } from 'react'
import { Layout } from '~/components/layout'
import { FormField } from '~/components/form-field'
import messages from "~/i18n/messages";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Updates the form data when an input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event.target.value }))
  }

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <h2 className="text-5xl font-extrabold text-yellow-300">{messages.loginform.welcome}</h2>
        <p className="font-semibold text-slate-300">{messages.loginform.description}</p>

        <form method="POST" className="rounded-2xl bg-gray-200 p-6 w-96">
          <FormField
            htmlFor="email"
            label={messages.loginform.email}
            value={formData.email}
            onChange={e => handleInputChange(e, 'email')}
          />
          <FormField
            htmlFor="password"
            type="password"
            label={messages.loginform.password}
            value={formData.password}
            onChange={e => handleInputChange(e, 'password')}
          />
          <div className="w-full text-center">
            <input
              type="submit"
              className="rounded-xl mt-2 bg-blue-600 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
              value={messages.loginform.login}
            />
          </div>
        </form>
      </div>
    </Layout>
  )
}
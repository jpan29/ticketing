
import Router from "next/router"
import { useState } from "react"
import useRequest from "../../hooks/use-request"

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  })

  const signUpHandler = async e => {
    e.preventDefault()
    doRequest()


  }
  return <form onSubmit={signUpHandler}>
    <h1>Sign Up</h1>
    <div className="form-group">
      <label>Email</label>
      <input className="form-control" type="text" value={email} onChange={e => setEmail(e.target.value)} />
    </div>
    <div className="form-group">
      <label>Password</label>
      <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} />
    </div>

    {errors}

    <button className="btn btn-primary">Sign Up</button>
  </form>
}
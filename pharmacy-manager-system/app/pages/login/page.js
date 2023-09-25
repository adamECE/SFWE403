

export default function Login() {
    return (
        <><div>
            <h1 className="test">I am the login page</h1>
        </div>
        <div className="form-container">
        <input
          type="text"
          placeholder="Username"
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
        />
        <button className="button">Login</button>
      </div></>
    )
  }
  
export default function Login() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src="logo1.jpeg" alt="" />
      </div>

      <div className=" flex flex-col justify-center">
        <form className="max-w-[400px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500">
          <h2 classNameName="text-4xl font-bold text-center py-6"></h2>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="insert email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="insert password"
            />
            <button
              className=" bg-blue-500 hover:bg-blue-700  border rounded w-full my-5 py-2  text-white appearance-none
            focus:outline-none
            focus:shadow-outline"
              type="button"
            >
              Sign In
            </button>
          </div>

          <div className="flex items-center justify-between">
            <a
              className="inline-block align-baseline text-white font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

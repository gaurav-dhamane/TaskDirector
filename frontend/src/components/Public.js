import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public h-screen bg-slate-800 text-green-400 flex flex-col ">
            <div className="wrapper text-center ">
                <h1 className="typing-demo text-green-500 text-4xl md:text-6xl font-bold">
                    Welcome to TaskDirector!
                </h1>
                <p className='text-slate-400 my-5 text-lg md:text-xl'>
                    Simplifying task assignment for efficient teamwork.
                </p>
                <p className='text-slate-400 max-w-screen-md my-5 text-lg md:text-xl'>
                    Empower your team with a centralized platform where administrators can effortlessly assign and oversee tasks, while team members stay organized with clear, actionable directives. Experience streamlined collaboration, real-time updates, and enhanced productivity.
                </p>
                <address className="text-slate-300 my-5 text-lg">
                    Developer: Gaurav Dhamane
                </address>
            </div>
            <footer className='flex flex-col md:flex-row justify-center gap-4 mt-8'>
                <Link className='px-6 py-3 text-slate-900 bg-green-600 text-center rounded hover:bg-green-700 transition duration-300 ease-in-out text-lg' to="/login">Login</Link>
                <Link className='px-6 py-3 text-slate-900 bg-green-600 text-center rounded hover:bg-green-700 transition duration-300 ease-in-out text-lg' to="/register">Register</Link>
            </footer>
        </section>

    )
    return content
}
export default Public
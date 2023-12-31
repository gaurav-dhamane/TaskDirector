import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public h-screen bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-purple-900 ">
            <div className="wrapper ">
                <h1 className="typing-demo text-stone-900">
                    Welcome to TaskDirector !
                </h1>
                <p className='text-neutral-500 my-5 '>Simplifying task assignment for efficient teamwork.</p>
                <p className='text-stone-900 text-center max-w-screen-lg mt-5'>Empower your team with a centralized platform where administrators can effortlessly assign and oversee tasks, while team members stay organized with clear, actionable directives. Experience streamlined collaboration, real-time updates, and enhanced productivity.</p>
                <address className="text-stone-900 text-center my-5 ">
                    Developer: Gaurav Dhamane<br />
                </address>

            </div>
            <footer className='flex justify-center gap-2' >
                <Link className=' flex px-4 py-2 text-stone-900 bg-emerald-600 rounded hover:bg-emerald-700 transition duration-300 ease-in-out' to="/login">User Login</Link>
                <Link className='flex px-4 py-2 text-stone-900 bg-emerald-600 rounded hover:bg-emerald-700 transition duration-300 ease-in-out' to="/teams">Register Team</Link>
            </footer>
        </section>

    )
    return content
}
export default Public
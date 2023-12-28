import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            {/* <header>
                <h1>Welcome to TaskDirector !</h1>
            </header> */}
            <div className="wrapper">
                <h1 className="typing-demo">
                    Welcome to TaskDirector !
                </h1>
                <p className='sub'>Simplifying task assignment for efficient teamwork.</p>
                <p className='subtitle'>Empower your team with a centralized platform where administrators can effortlessly assign and oversee tasks, while team members stay organized with clear, actionable directives. Experience streamlined collaboration, real-time updates, and enhanced productivity.</p>
                <address className="public__addr">
                    Developer: Gaurav Dhamane<br />
                </address>
            
                </div>
            <footer className='center-container' >
                <Link className='public__button' to="/login">User Login</Link>
                <Link className='public__button' to="/teams">Register Team</Link>
            </footer>
        </section>

    )
    return content
}
export default Public
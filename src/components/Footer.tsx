import React from 'react'
import "../assets/css/footer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import 'font-awesome/css/font-awesome.min.css';

const Footer = () => {
    return (
        <div className='p-5 footer'>
            <div className='d-flex justify-content-between'>
                <div>
                    <img src={require("../assets/Images/zomato-name-black.avif")} height='28' width='132' alt='' />
                </div>
                <div className='d-flex'>
                    <div className='border rounded footer-div'>
                        <div>
                            <img src={require("../assets/Images/india.png")} height='25' width='28' alt=''/>
                        </div>
                        <div>India</div>
                    </div>
                    <div className='border rounded footer-div ms-4'>
                        <div>
                            <FontAwesomeIcon icon={faGlobe} />
                        </div>
                        <div>English</div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-between'>
                <div className='footer-link-outer-div mt-5'>
                    <div>ABOUT ZOMATO</div>
                    <nav className='footer-links footer-link-div'>
                        <a className='mb-2' href='#'>Who We Are</a>
                        <a className='mb-2' href='#'>Blog</a>
                        <a className='mb-2' href='#'>Work With Us</a>
                        <a className='mb-2' href='#'>Investor Relations</a>
                        <a className='mb-2' href='#'>Report Fraud</a>
                        <a className='mb-2' href='#'>Press Kit</a>
                        <a className='mb-2' href='#'>Contact Us</a>
                    </nav>
                </div>
                <div className='footer-link-outer-div mt-5'>
                    <div>ZOMAVERSE</div>
                    <nav className='footer-links footer-link-div'>
                        <a className='mb-2' href='#'>Zomato</a>
                        <a className='mb-2' href='#'>Blinkit</a>
                        <a className='mb-2' href='#'>Feeding India</a>
                        <a className='mb-2' href='#'>Hyperpure</a>
                        <a className='mb-2' href='#'>Zomaland</a>
                      
                    </nav>
                </div>
                <div className='d-flex flex-column'>
                    <div className='footer-link-outer-div-middle mt-5'>
                        <div>FOR RESTAURANTS</div>
                        <nav className='footer-links footer-link-div-middle'>
                            <a className='mb-2' href='#'>Partner With Us</a>
                            <a className='mb-2' href='#'>Apps For You</a>
                        </nav>
                    </div>
                    <div className='footer-link-outer-div-middle mt-5'>
                        <div>FOR ENTERPRISES</div>
                        <nav className='footer-links footer-link-div-middle'>
                            <a className='mb-2' href='#'>Zomato For Enterprise</a>
                        </nav>
                    </div>
                </div>
                <div className='footer-link-outer-div mt-5'>
                    <div>LEARN MORE</div>
                    <nav className='footer-links footer-link-div'>
                        <a className='mb-2' href='#'>Privacy</a>
                        <a className='mb-2' href='#'>Security</a>
                        <a className='mb-2' href='#'>Terms</a>
                        <a className='mb-2' href='#'>Sitemap</a>
                        <a className='mb-2' href='#'>Policy</a>
                    </nav>
                </div>
                <div className='footer-link-outer-div mt-5'>
                    <div>SOCIAL LINKS</div>
                    <nav className='footer-links footer-link-div'>
                            <div><i  className="fa fa-linkedin fa-lg me-3 mb-2"/>Linkedin</div>
                            <div><i  className="fa fa-instagram fa-lg me-3 mb-2"/>Instagram</div>
                            <div><i  className="fa fa-twitter fa-lg me-3 mb-2"/>Twitter</div>
                            <div><i  className="fa fa-youtube fa-lg me-3 mb-2"/>YouTube</div>
                            <div><i  className="fa fa-facebook fa-lg me-4 mb-2"/>Facebook</div>
                    </nav>
                </div>
            </div>
            <hr className='mt-4'/>
            <div className='footer-links'>
            By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2008-2023 © Zomato™ Ltd. All rights reserved.
            </div>
        </div>
    )
}

export default Footer
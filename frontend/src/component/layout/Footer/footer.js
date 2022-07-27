import React from 'react';
import playstore from '../../images/playstore.png';
import appStore from '../../images/appstore.png';
import './Footer.css';

const Footer= () =>{
    return (
        <footer id='footer'>
            <div className='leftFooter'>
                <h4>Download our App</h4>
                <p>Download app from playstore and appstore.js</p>
                <img src={playstore} alt="playstore" />
                <img src={appStore} alt="appstore" />
            </div>
            <div className='midFooter'>
                <h1>Ecommerce</h1>
                <p>Some Tagline</p>

                <p>Copyright 2022 &copy; D B Shankar</p>
            </div>
            <div className='rightFooter'>
                <h4>Follow us</h4>
                <a href="https://www.linkedin.com/in/bhima-shankar-devarakonda-26963a1ba/">LinkedIn</a>
                <a href="https://github.com/bhima2001">Github</a>
            </div>
        </footer>
    )
}
export default Footer;
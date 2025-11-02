import CallIcon from '@mui/icons-material/Call';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

export default function LandingPage() {
    
    
    return (
        <div>
            <div className="preloader-progress">
                <div className="preloader-progress-bar"></div>
                <div className="preloader-logo">
                    <h1>Icebank</h1>
                </div>
            </div>

            <div className="preloader-mask"></div>

            <div className="preloader-content">
                <div className="preloader-footer">
                    <p>They said life's about balance, and your balance's safe with us.</p>
                </div>
            </div>

            <div className="container">
                <section className="hero">
                    <div className="hero-inner">
                        <div className="hero-img">
                            <img src="./Assets/IcebankHero.png" alt=""></img>
                        </div>

                        <div className="hero-content">
                            <div className="header">
                                <h1>Icebank</h1>
                            </div>

                            <div className="contact-btn">
                                <div className="btn">
                                    <div className="btn-label">
                                        <span>Contact Us</span>
                                    </div>
                                    <div className="btn-icon">
                                        <CallIcon />
                                    </div>
                                </div>
                            </div>

                            <div className="scroll-down-btn">
                                <div className="btn">
                                    <div className="btn-label">
                                        <span>Scroll Down</span>
                                    </div>
                                    <div className="btn-icon">
                                        <KeyboardDoubleArrowDownIcon />
                                    </div>
                                </div>
                            </div>

                            <div className="hero-footer">
                                <h3>lorem ipsum dolor sit amet</h3>
                                <p>consectetur adipiscing elit</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
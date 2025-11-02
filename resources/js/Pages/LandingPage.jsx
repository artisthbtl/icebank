import { useRef } from 'react';
import CallIcon from '@mui/icons-material/Call';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import heroImage from '../Assets/IcebankHero.png';
import './LandingPage.css';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, useGSAP);

export default function LandingPage() {
    const container = useRef(null);

    useGSAP(() => {
        
        const splits = {
            logoChars: new SplitText(".preloader-logo h1", { type: "chars" }),
            footerLines: new SplitText(".preloader-footer p", { type: "lines" }),
            headerChars: new SplitText(".header h1", { type: "chars" }),
            heroFooterH3: new SplitText(".hero-footer h3", { type: "lines" }),
            heroFooterP: new SplitText(".hero-footer p", { type: "lines" }),
            btnLabels: new SplitText(".btn-label span", { type: "lines" }),
        };

        gsap.set([splits.logoChars.chars], { x: "100%" });
        gsap.set(
            [
                splits.footerLines.lines,
                splits.headerChars.chars,
                splits.heroFooterH3.lines,
                splits.heroFooterP.lines,
                splits.btnLabels.lines,
            ],
            { y: "100%" }
        );
        gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });
        gsap.set(".btn", { scale: 0 });

        function animateProgress(duration = 4) {
            const tl = gsap.timeline();
            const counterSteps = 5;
            let currentProgress = 0;

            for (let i = 0; i < counterSteps; i++) {
                const finalStep = i === counterSteps - 1;
                const targetProgress = finalStep
                    ? 1
                    : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
                currentProgress = targetProgress;

                tl.to(".preloader-progress-bar", {
                    scaleX: targetProgress,
                    duration: duration / counterSteps,
                    ease: "power2.out",
                });
            }

            return tl;
        }

        const tl = gsap.timeline({ delay: 0.5 });

        tl.to(splits.logoChars.chars, {
            x: "0%",
            stagger: 0.05,
            duration: 1,
            ease: "power4.inOut",
        })
        .to(
            splits.footerLines.lines,
            {
                y: "0%",
                stagger: 0.1,
                duration: 1,
                ease: "power4.inOut",
            },
            "0.25"
        )
        .add(animateProgress(), "<")
        .set(".preloader-progress", { backgroundColor: "var(--base-300)" })
        .to(
            splits.logoChars.chars,
            {
                x: "-100%",
                stagger: 0.05,
                duration: 1,
                ease: "power4.inOut",
            },
            "-=0.5"
        )
        .to(
            splits.footerLines.lines,
            {
                y: "-100%",
                stagger: 0.1,
                duration: 1,
                ease: "power4.inOut",
            },
            "<"
        )
        .to(
            ".preloader-progress",
            {
                opacity: 0,
                duration: 0.5,
                ease: "power3.out",
            },
            "-=0.25"
        )
        .to(
            ".preloader-mask",
            {
                scale: 5,
                duration: 2.5,
                ease: "power3.out",
            },
            "<"
        )
        .to(
            ".hero-img",
            {
                scale: 1,
                duration: 1.5,
                ease: "power3.out",
            },
            "<"
        )
        .to(splits.headerChars.chars, {
            y: 0,
            stagger: 0.05,
            duration: 1,
            ease: "power4.out",
            delay: -2,
        })
        .to(
            [splits.heroFooterH3.lines, splits.heroFooterP.lines],
            {
                y: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power4.out",
            },
            "-=1.5"
        )
        .to(
            ".btn",
            {
                scale: 1,
                duration: 1,
                ease: "power4.out",
            },
            "<"
        )
        .to(
            ".btn-icon",
            {
                clipPath: "circle(100% at 50% 50%)",
                duration: 1,
                ease: "power2.out",
            },
            "<-0.75"
        )
        .to(
            splits.btnLabels.lines,
            {
                y: 0,
                duration: 1,
                ease: "power4.out",
            },
            "<"
        );

    }, { scope: container });

    return (
        <div ref={container}>
            <div className="preloader-progress">
                <div className="preloader-progress-bar"></div>
                <div className="preloader-logo">
                    <h1>Icebank</h1>
                </div>
            </div>

            <div className="preloader-mask"></div>

            <div className="preloader-content">
                <div className="preloader-footer">
                    <p>The most secure and reliable digital banking experience.</p>
                </div>
            </div>

            <div className="container">
                <section className="hero">
                    <div className="hero-inner">
                        <div className="hero-img">
                            <img src={heroImage} alt="Icebank Hero"></img>
                        </div>

                        <div className="hero-content">
                            <div className="header">
                                <h1>Icebank</h1>
                            </div>

                            <div className="register-btn">
                                <div className="btn">
                                    <div className="btn-label">
                                        <span>Register</span>
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
                                <h3>They said life's about balance, and your balance's safe with us.</h3>
                                <p>artisthbtl</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
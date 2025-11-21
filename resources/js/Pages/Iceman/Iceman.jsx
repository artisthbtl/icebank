import { useRef } from 'react';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import heroImage from '../../Assets/IcebankHero.png';
import '../../../css/landingPage.css';
import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, useGSAP);
gsap.registerPlugin(SplitText, useGSAP, ScrollTrigger);

export default function LandingPage() {
    gsap.set("body", { overflow: "hidden" });
    gsap.set(document.documentElement, { overflow: "hidden" });
    gsap.set(document.body, { overflow: "hidden" });
    const container = useRef(null);

    useGSAP(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            gsap.set(".hero-img", { scale: 1 });
            gsap.set(".header h1", { clipPath: "inset(0% 0 0 0)" });
            gsap.set([document.documentElement, document.body], { overflow: "auto" });
            return;
        }
        
        const splits = {
            logoChars: new SplitText(".preloader-logo h1", { type: "chars" }),
            footerLines: new SplitText(".preloader-footer p", { type: "lines" }),
            heroParagraphH3: new SplitText(".hero-paragraph h3", { type: "lines" }),
            heroParagraphP: new SplitText(".hero-paragraph p", { type: "lines" }),
            btnLabels: new SplitText(".btn-label span", { type: "lines" })
        };

        gsap.set([splits.logoChars.chars], { clipPath: "inset(0 100% 0 0)" });
        gsap.set(
            [
                splits.footerLines.lines,
                splits.btnLabels.lines,
            ],
            { y: "100%" }
        );
        gsap.set([splits.heroParagraphH3.lines, splits.heroParagraphP.lines], { clipPath: "inset(0 0 100% 0)" });
        gsap.set(".header h1", { clipPath: "inset(100% 0 0 0)" });
        gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });
        gsap.set(".btn", { scale: 0 });
        gsap.set(".wipe-reveal-text-bright", { clipPath: "inset(0 0 100% 0)" });

        function animateProgress(duration = 2) {
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

        const tl = gsap.timeline({ delay: 0.1 });

        tl.to(splits.logoChars.chars, {
            clipPath: "inset(0 0% 0 0)",
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
                clipPath: "inset(0 0 0 100%)",
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
            [".preloader-progress", ".preloader-content"],
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
        .to(".header h1", {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.5,
            ease: "power4.out",
            delay: -2,
        })
        .to(
            [splits.heroParagraphH3.lines, splits.heroParagraphP.lines],
            {
                clipPath: "inset(0 0 0% 0)",
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
        )
        .set([".preloader-mask", ".preloader-progress", ".preloader-content"], { 
            display: "none" 
        })
        .set(document.documentElement, { 
            overflow: "auto"
        }, "<")
        .set(document.body, { 
            overflow: "auto"
        }, "<");

        gsap.fromTo(".hero-img", 
            { scale: 1 },
            { 
                scale: 1.08,
                immediateRender: false,
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "75% top",
                    scrub: true,
                }
            }
        );

        gsap.to(".wipe-reveal-text-bright", {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
                trigger: ".page-2",
                start: "top 75%", 
                end: "top 25%",
                scrub: true,
            }
        });

    }, { scope: container });

    return (
        <div ref={container}>
            <div className="preloader-progress">
                <div className="preloader-progress-bar"></div>
                <div className="preloader-logo">
                    <h1>Iceman</h1>
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
                                <h1>Iceman</h1>
                            </div>

                            <div className="header-buttons">
                                <Link href={route('iceman.login')} className="btn btn-outline">
                                    <div className="btn-label">
                                        <span>Login</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
import { videoFrame } from "../ImageAssets";
import React from 'react';



export function ContentVideo (){
    return (
        <>
            <div className="video section">
                <div className="container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4">
                    <div className="section-heading text-center">
                        <h6>| Video View</h6>
                        <h2>Get Closer View & Different Feeling</h2>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            
            <div className="video-content">
                <div className="container">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                    <div className="video-frame">
                        <img src={videoFrame} alt="Video Frame" />
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-play"></i>
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            
            
            {/* ***** Fun Facts Start ***** */}
            <div className="fun-facts">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="wrapper">
                        <div className="row">
                        <div className="col-lg-4">
                            <div className="counter">
                                <h2 className="timer count-title count-number" style={{ fontWeight:"700" }}>
                                    50
                                </h2>
                                <p className="count-text">Buildings<br />Finished Now</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="counter">
                                <h2 className="timer count-title count-number" style={{ fontWeight:"700" }}>
                                    12
                                </h2>
                                <p className="count-text">Years<br />Experience</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="counter">
                                <h2 className="timer count-title count-number"  style={{ fontWeight:"700" }}>
                                    24
                                </h2>
                                <p className="count-text">Awards<br />Won 2023</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* ***** Fun Facts End ***** */}
        </>
    )
}
import { Footer } from "./components/General/Footer";
import { Heading } from "./components/General/Heading";
import { Header } from "./components/General/Nav";
import { Map } from "./components/General/Map";
import { Form } from "./components/General/Form";
import { InfoContact } from "./components/General/InfoContact";
import React from 'react';

export function Contact () {
    return (
        <>
            {/* ***** Header Area Start ***** */}
            <Header />
            {/* ***** Header Area End ***** */}

            {/* ***** Heading Start ***** */}
            <Heading title="Contact" />
            {/* ***** Heading End ***** */}
            
            {/* ***** Main Section Start ***** */}
            <div className="contact-page section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-heading">
                                <h6>| Contact Us</h6>
                                <h2>Get In Touch With Our Agents</h2>
                            </div>
                            <p>
                                When you really need to download free CSS templates, please remember our website TemplateMo. Also, tell your friends about our website. Thank you for visiting. There is a variety of Bootstrap HTML CSS templates on our website. If you need more information, please contact us.
                            </p>
                            <InfoContact wrap={true} />
                        </div>
                        
                        <div className="col-lg-6">
                            <Form />
                        </div>
                        
                        <div className="col-lg-12">
                            <Map />
                        </div>
                    </div>
                </div>
            </div>
            {/* ***** Main Section End ***** */}

            {/* ***** Properties Section Start ***** */}
            <Footer />
            {/* ***** Properties Section End ***** */}
        </>
    );
}

import React from 'react';

export function Form () {
    return (
        <form id="contact-form" action="" method="post">
            <div className="row">
                <div className="col-lg-12">
                    <fieldset>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" name="name" id="name" placeholder="Your Name..." autoComplete="on" required />
                    </fieldset>
                </div>
                <div className="col-lg-12">
                    <fieldset>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        pattern="[^ @]*@[^ @]*"
                        placeholder="Your E-mail..."
                        required
                    />
                    </fieldset>
                </div>
                <div className="col-lg-12">
                    <fieldset>
                    <label htmlFor="subject">Subject</label>
                    <input type="text" name="subject" id="subject" placeholder="Subject..." autoComplete="on" />
                    </fieldset>
                </div>
                <div className="col-lg-12">
                    <fieldset>
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" placeholder="Your Message"></textarea>
                    </fieldset>
                </div>
                <div className="col-lg-12">
                    <fieldset>
                    <button type="submit" id="form-submit" className="orange-button">Send Message</button>
                    </fieldset>
                </div>
            </div>
        </form>
    )
}
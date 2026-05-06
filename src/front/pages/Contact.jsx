import { useRef } from 'react';
import emailjs from '@emailjs/browser';

export const Contact = () => {

    const emailJSPKey = import.meta.env.VITE_EMAIL_JS
    const form = useRef();

    function sendData(e) {
        e.preventDefault();
        emailjs.sendForm("service_qmfaee8", "template_yjmh02b" , form.current, {
            publicKey: emailJSPKey
        })
            .then(() => {
                console.log('SUCCESS!');
            }, (error) => {
                console.log('FAILED...', error);
            });
    }

    return (
        <section className="contact py-5 bg-dark" id="contact">
            <div className="container">
                <h2 className="section-title text-center mb-5">Contacta con el equipo</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <form className="contact-form" ref={form}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <input type="text" className="form-control" placeholder="Tu nombre" required name='name'/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="email" className="form-control" placeholder="Correo electrónico" required name='email'/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Asunto" required name='title'/>
                            </div>
                            <div className="mb-4">
                                <textarea className="form-control" rows="6" placeholder="Cuéntanos..." name='message'></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-100" onClick={sendData}>Enviar Mensaje</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}; 
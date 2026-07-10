import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export const Contact = () => {
  const emailJSPKey = import.meta.env.VITE_EMAIL_JS;
  const form = useRef();
  const [messageStatus, setMessageStatus] = useState("");

  function sendData(e) {
    e.preventDefault();
    setMessageStatus("Enviando mensaje...");

    emailjs
      .sendForm("service_qmfaee8", "template_yjmh02b", form.current, {
        publicKey: emailJSPKey
      })
      .then(
        () => {
          setMessageStatus("Mensaje enviado correctamente.");
          form.current.reset();
        },
        () => {
          setMessageStatus("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        }
      );
  }

  return (
    <section className="contact-page eh-inner-section" id="contact">
      <div className="eh-page-glow eh-page-glow-one"></div>
      <div className="eh-page-glow eh-page-glow-two"></div>

      <div className="container position-relative">
        <div className="eh-inner-header text-center">
          <h2 className="section-title">Contacta con el equipo</h2>
          <p className="section-description mx-auto">
            ¿Tienes dudas, ideas o quieres saber más sobre Event Hub? Escríbenos.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-9">
            <form className="contact-form-pro" ref={form} onSubmit={sendData}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input type="text" placeholder="Tu nombre" required name="name" />
                </div>

                <div className="col-md-6 mb-3">
                  <input type="email" placeholder="Correo electrónico" required name="email" />
                </div>
              </div>

              <div className="mb-3">
                <input type="text" placeholder="Asunto" required name="title" />
              </div>

              <div className="mb-4">
                <textarea rows="6" placeholder="Cuéntanos..." required name="message"></textarea>
              </div>

              <button type="submit" className="eh-main-gradient-btn w-100">
                Enviar mensaje
              </button>

              {messageStatus && <p className="contact-status">{messageStatus}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
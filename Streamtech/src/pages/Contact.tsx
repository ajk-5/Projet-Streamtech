import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  acceptTerms: false,
};
type FormErrors = Partial<Record<keyof typeof emptyForm, string>>;

function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, [success]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;
    const newValue =
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
        ? event.target.checked
        : value;
    setFormData((previous) => ({ ...previous, [name]: newValue }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newErrors: FormErrors = {};
    if (formData.name.trim().length < 2)
      newErrors.name = "Le nom doit contenir au moins 2 caractères.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Saisissez une adresse email valide.";
    if (!formData.subject) newErrors.subject = "Choisissez un sujet.";
    if (formData.message.trim().length < 10)
      newErrors.message = "Le message doit contenir au moins 10 caractères.";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Votre accord est requis.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    // Simulation demandée dans l’exercice : aucun message n’est envoyé.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    setFormData(emptyForm);
    setIsSubmitting(false);
  }

  return (
    <div className="col-md-8 mx-auto">
      <h1 className="mb-4">📬 Contactez-nous</h1>
      {success && (
        <div className="alert alert-success alert-dismissible" role="status">
          <strong>✅ Message envoyé !</strong> Nous vous répondrons dans les
          plus brefs délais.
          <button
            type="button"
            className="btn-close"
            aria-label="Fermer"
            onClick={() => setSuccess(false)}
          />
        </div>
      )}
      <form
        className="card card-body shadow p-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset disabled={isSubmitting}>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
                required
              />
              <div id="name-error" className="invalid-feedback">
                {errors.name}
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                required
              />
              <div id="email-error" className="invalid-feedback">
                {errors.email}
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="subject" className="form-label">
                Sujet
              </label>
              <select
                id="subject"
                name="subject"
                className={`form-select ${errors.subject ? "is-invalid" : ""}`}
                value={formData.subject}
                onChange={handleChange}
                aria-invalid={!!errors.subject}
                aria-describedby="subject-error"
                required
              >
                <option value="">Choisissez un sujet</option>
                <option value="question">Question générale</option>
                <option value="bug">Signaler un bug</option>
                <option value="feature">Demande de fonctionnalité</option>
                <option value="other">Autre</option>
              </select>
              <div id="subject-error" className="invalid-feedback">
                {errors.subject}
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`form-control ${errors.message ? "is-invalid" : ""}`}
                value={formData.message}
                onChange={handleChange}
                aria-invalid={!!errors.message}
                aria-describedby="message-help message-error"
                required
              />
              <div id="message-help" className="form-text">
                {formData.message.length}/500 caractères
              </div>
              <div id="message-error" className="invalid-feedback">
                {errors.message}
              </div>
            </div>
            <div className="col-12">
              <div className="form-check">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  className={`form-check-input ${errors.acceptTerms ? "is-invalid" : ""}`}
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  aria-invalid={!!errors.acceptTerms}
                  aria-describedby="terms-error"
                  required
                />
                <label className="form-check-label" htmlFor="acceptTerms">
                  J'accepte les conditions d'utilisation
                </label>
                <div id="terms-error" className="invalid-feedback">
                  {errors.acceptTerms}
                </div>
              </div>
            </div>
            <div className="col-12">
              <button className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "📨 Envoyer le message"}
              </button>
            </div>
          </div>
        </fieldset>
      </form>
      <div className="row g-3 mt-3 text-center">
        {[
          { title: "Adresse", text: "123 Rue du Web, 75001 Paris" },
          { title: "Email", text: "contact@streamtech.fr" },
          { title: "Téléphone", text: "01 23 45 67 89" },
        ].map((info) => (
          <div className="col-md-4" key={info.title}>
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">{info.title}</h2>
                <p className="small text-body-secondary mb-0">{info.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Contact;

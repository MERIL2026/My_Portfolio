import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { SectionHeading } from "./SectionHeading";
import emailjs from '@emailjs/browser';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export function Contact() {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContactFormData>();
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        setValue("message", customEvent.detail.message);
        const element = document.getElementById("contact");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("contact-prefill", handlePrefill);
    return () => window.removeEventListener("contact-prefill", handlePrefill);
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          message: data.message.trim(),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Backend insert error:", responseData.error, responseData.details);
        setSubmitStatus("error");
      } else {
        // Send email via EmailJS
        try {
          const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
          const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
          const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

          if (serviceId && templateId && publicKey) {
            await emailjs.send(
              serviceId,
              templateId,
              {
                name: data.name.trim(), // Matches {{name}} in your template
                email: data.email.trim(), // Matches {{email}} in the "To Email" field
                title: "Portfolio Contact Form", // Matches {{title}} in your template
                from_name: data.name.trim(),
                from_email: data.email.trim(),
                message: data.message.trim(),
              },
              publicKey
            );
          } else {
            console.warn("EmailJS credentials missing. Email not sent, but message saved to database.");
          }
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // We don't set status to error here because the message was successfully saved to Supabase
        }

        setSubmitStatus("success");
        reset();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-brand-paper text-brand-black px-6 py-24 md:py-32 relative overflow-hidden">

      {/* Background oversized text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-full text-center">
        <h1 className="font-heading text-[25vw] uppercase leading-none">REACH OUT</h1>
      </div>

      <div className="max-w-[1140px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <SectionHeading className="text-brand-black">Let's Talk</SectionHeading>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-medium mt-8 mb-12 max-w-md"
          >
            Have a project in mind, or just want to say hi? Fill out the form or drop me an email.
          </motion.p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">Email</span>
              <a href="mailto:merilpu37@gmail.com" className="font-heading text-3xl md:text-4xl hover:text-brand-orange transition-colors">merilpu37@gmail.com</a>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">Social</span>
              <div className="flex flex-wrap gap-6">
                <a href="https://github.com/MERIL2026" target="_blank" rel="noopener noreferrer" className="font-bold uppercase tracking-wider hover:text-brand-orange transition-colors border-b-2 border-brand-black hover:border-brand-orange">GitHub</a>
                <a href="https://www.linkedin.com/in/meril-parmar-940366363/" target="_blank" rel="noopener noreferrer" className="font-bold uppercase tracking-wider hover:text-brand-orange transition-colors border-b-2 border-brand-black hover:border-brand-orange">LinkedIn</a>
                <a href="https://www.instagram.com/meril_parmar_/" target="_blank" rel="noopener noreferrer" className="font-bold uppercase tracking-wider hover:text-brand-orange transition-colors border-b-2 border-brand-black hover:border-brand-orange">Instagram</a>
                <a href="https://about.me/merilparmar" target="_blank" rel="noopener noreferrer" className="font-bold uppercase tracking-wider hover:text-brand-orange transition-colors border-b-2 border-brand-black hover:border-brand-orange">About Me</a>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 bg-brand-black p-8 md:p-10 text-brand-white relative">
            {submitStatus === "success" && (
              <div className="absolute inset-0 bg-brand-orange text-brand-black flex flex-col items-center justify-center p-8 text-center z-20">
                <h3 className="font-heading text-4xl uppercase mb-4">Message Sent</h3>
                <p className="font-bold uppercase tracking-widest text-sm mb-6">I'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="border-2 border-brand-black px-6 py-2 hover:bg-brand-black hover:text-brand-white transition-colors uppercase font-bold text-xs"
                >
                  Send Another
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-brand-gray">Name</label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 100, message: "Name must be 100 characters or less" }
                })}
                type="text"
                id="name"
                maxLength={100}
                className="bg-transparent border-b-2 border-brand-dark py-3 focus:outline-none focus:border-brand-orange transition-colors font-mono"
                placeholder="JOHN DOE"
              />
              {errors.name && <span className="text-brand-orange text-xs font-mono">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-brand-gray">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                  maxLength: { value: 150, message: "Email must be 150 characters or less" }
                })}
                type="email"
                id="email"
                maxLength={150}
                className="bg-transparent border-b-2 border-brand-dark py-3 focus:outline-none focus:border-brand-orange transition-colors font-mono"
                placeholder="JOHN@EXAMPLE.COM"
              />
              {errors.email && <span className="text-brand-orange text-xs font-mono">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-brand-gray">Message</label>
              <textarea
                {...register("message", {
                  required: "Message is required",
                  minLength: { value: 10, message: "Message must be at least 10 characters" },
                  maxLength: { value: 5000, message: "Message must be 5000 characters or less" }
                })}
                id="message"
                rows={4}
                maxLength={5000}
                className="bg-transparent border-b-2 border-brand-dark py-3 focus:outline-none focus:border-brand-orange transition-colors font-mono resize-none"
                placeholder="TELL ME ABOUT YOUR PROJECT..."
              ></textarea>
              {errors.message && <span className="text-brand-orange text-xs font-mono">{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-white text-brand-black py-4 mt-6 font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {submitStatus === "error" && (
              <p className="text-brand-orange text-xs font-mono text-center">Failed to send message. Please try again.</p>
            )}
          </form>
        </motion.div>

      </div>
    </section>
  );
}

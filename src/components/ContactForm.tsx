'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import Input from "./ui/Input";
import Title from "./ui/Title";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { useBrowserInfo } from "@/hooks/useBrowserInfo";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const browserInfo = useBrowserInfo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Ajouter les informations du navigateur aux données du formulaire
      const formDataWithBrowserInfo = {
        ...data,
        ...browserInfo,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithBrowserInfo),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du formulaire');
      }

      const result = await response.json();
      setSubmitMessage({ type: 'success', text: 'Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.' });
      reset();
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-3 w-full">
      <div className="flex h-full flex-col justify-center gap-4 rounded-xl p-6 shadow-sm bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex gap-4 flex-col">
            <div className="flex">
              <Title>Contactez-nous</Title>
            </div>
            <p>Profitez de la remise de -15% sur votre projet!</p>
          </div>
          
          {submitMessage && (
            <div className={`p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div className="rounded-xl flex flex-col gap-4">
            <div className="flex gap-4 flex-col w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex-1">
                  <Input
                    label="Nom"
                    placeholder="Nom"
                    type="text"
                    {...register("lastName")}
                    error={errors.lastName?.message}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Prénom"
                    placeholder="Prénom"
                    type="text"
                    {...register("firstName")}
                    error={errors.firstName?.message}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex-1">
                  <Input
                    label="Email"
                    placeholder="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Téléphone"
                    placeholder="Téléphone"
                    type="tel"
                    {...register("phone")}
                    error={errors.phone?.message}
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <p className="text-base mb-2 relative">
                    Services
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <CheckBox
                    label="Création de site web"
                    id="website"
                    {...register("services.website")}
                  />
                  <CheckBox
                    label="Développement sur mesure"
                    id="custom"
                    {...register("services.custom")}
                  />
                  <CheckBox 
                    label="UI/UX Design" 
                    id="design" 
                    {...register("services.design")}
                  />
                  <CheckBox
                    label="Consulting & stratégie digitale"
                    id="consulting"
                    {...register("services.consulting")}
                  />
                  <CheckBox 
                    label="SEO & visibilité" 
                    id="seo" 
                    {...register("services.seo")}
                  />
                  <CheckBox
                    label="Maintenance & support"
                    id="support"
                    {...register("services.support")}
                  />
                </div>
                {errors.services && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.services.message}</span>
                )}
              </div>
              <div>
                <Input
                  label="Message"
                  placeholder="Message"
                  type="textarea"
                  {...register("message")}
                  error={errors.message?.message}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#4990f9] hover:bg-[#3d7ce6] text-white'
                }`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

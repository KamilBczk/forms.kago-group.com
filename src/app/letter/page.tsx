import ContactForm from "@/components/ContactForm";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="bg-gray-50">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center min-h-screen py-24">
              <ContactForm />
            </div>
          </div>
        </div>
    </div>
  );
}

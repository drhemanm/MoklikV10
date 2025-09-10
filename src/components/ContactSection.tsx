import { Mail, Phone, Clock } from 'lucide-react';

export function ContactSection() {
  return (
    <div className="glass rounded-2xl shadow-glass p-8 hover:shadow-glow transition-all">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Mail className="w-6 h-6 text-blue-600" />
        Contact Information
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex items-start gap-4 md:border-r border-gray-200">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Email</h3>
            <a href="mailto:contact@moklik.org" className="text-blue-600 hover:text-blue-700">
              contact@moklik.org
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 md:border-r border-gray-200">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Phone</h3>
            <a href="tel:58527769" className="text-blue-600 hover:text-blue-700">
              5259 3285
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Office Hours</h3>
            <p className="text-gray-600">Monday to Friday</p>
            <p className="text-gray-600">9:00 AM - 5:00 PM (Local Time)</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg md:col-span-3">
          <p className="text-sm text-blue-800">
            For urgent matters, please include "URGENT" in your email subject line. We aim to respond to all inquiries within 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
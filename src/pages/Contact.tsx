import React from 'react';
import { Mail, Phone, Clock, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Header } from '../components/Header';

export function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-tertiary-light">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="glass rounded-2xl shadow-glass p-8 hover:shadow-glow transition-all space-y-8">
            {/* Contact Information Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  <a href="mailto:contact@moklik.org" className="text-blue-600 hover:text-blue-700 block">
                    contact@moklik.org
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    For general inquiries and support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <a href="tel:58527769" className="text-blue-600 hover:text-blue-700 block">
                    5259 3285
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon-Fri from 9am to 5pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Office Hours</h3>
                  <p className="text-gray-600">Monday to Friday</p>
                  <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                  <p className="text-sm text-gray-500 mt-1">Local Time</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Port Louis</p>
                  <p className="text-gray-600">Mauritius</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/moklik25/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-600" />
                </a>
                <a
                  href="https://twitter.com/moklik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Twitter className="w-6 h-6 text-blue-400" />
                </a>
                <a
                  href="https://instagram.com/moklik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-pink-600" />
                </a>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 rounded-lg p-4 mt-8">
              <h3 className="font-medium text-blue-900 mb-2">Important Note</h3>
              <p className="text-sm text-blue-800">
                For urgent inquiries, please include "URGENT" in your email subject line. 
                We aim to respond to all messages within 1-2 business days. For immediate 
                assistance during business hours, please call our support line.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-500">
        Designed and Developed with love by Carpus Connect
      </footer>
    </div>
  );
}
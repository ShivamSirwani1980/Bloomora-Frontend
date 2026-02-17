import { Link } from 'react-router-dom';
import { Flower2, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  shop: [
    { name: 'All Flowers', path: '/shop' },
    { name: 'Exotic Flowers', path: '/shop?category=exotic' },
    { name: 'Roses', path: '/shop?category=roses' },
    { name: 'Bouquets', path: '/shop?category=bouquets' },
    { name: 'Custom Bouquet', path: '/custom-bouquet' },
  ],
  services: [
    { name: 'Gifting', path: '/gifting' },
    { name: 'Wedding Decoration', path: '/decoration' },
    { name: 'Event Decoration', path: '/decoration' },
    { name: 'Corporate Gifting', path: '/gifting' },
    { name: 'Subscription', path: '/subscription' },
  ],
  support: [
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Track Order', path: '/dashboard' },
    { name: 'Shipping Info', path: '/faqs' },
    { name: 'Returns', path: '/faqs' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/about' },
    { name: 'Careers', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Press', path: '/about' },
  ],
};

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Youtube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-rose-light/30 border-t border-border">
      {/* Newsletter Section */}
      <div className="container-custom mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="bg-gradient-to-r from-primary/10 to-lavender/10 rounded-3xl p-8 md:p-12 text-center mb-16">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Bloom with Us
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Subscribe to get exclusive offers, new arrivals, and floral inspiration delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 input-premium text-center sm:text-left"
            />
            <Button variant="hero">Subscribe</Button>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Flower2 className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl font-bold text-gradient">Bloomora</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Your one-stop destination for exotic flowers, custom bouquets, and premium floral services.
            </p>
            <div className="space-y-3">
              <a href="tel:+911234567890" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 123 456 7890</span>
              </a>
              <a href="mailto:hello@bloomora.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@bloomora.com</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Bloomora. All rights reserved. Made with 💐 in India.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

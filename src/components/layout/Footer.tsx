import { Link } from 'react-router-dom';
import { Flower2, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

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
    { name: 'Customer Feedback', path: '/feedback' },
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
  const { settings } = useStore();
  return (
    <footer className="bg-gradient-to-b from-background to-rose-light/30 border-t border-border">
      <div className="container-custom mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                {settings?.logo_url ? (
                  <div className="w-full h-full rounded-xl overflow-hidden border border-primary/20 bg-background/50 text-center">
                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Flower2 className="w-8 h-8 text-primary" />
                )}
              </div>
              <span className="font-display text-2xl font-bold text-gradient">
                {settings?.site_name || 'Bloomora'}
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              {settings?.tagline || 'Your one-stop destination for exotic flowers, custom bouquets, and premium floral services.'}
            </p>
            <div className="space-y-3">
              <a href={`tel:${settings?.support_phone || '+911234567890'}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>{settings?.support_phone || '+91 123 456 7890'}</span>
              </a>
              <a href={`mailto:${settings?.support_email || 'hello@bloomora.com'}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>{settings?.support_email || 'hello@bloomora.com'}</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{settings?.location || 'Mumbai, India'}</span>
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
              <li>
                <Link to="/admin/login" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                  <Shield className="w-3 h-3" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Bloomora. All rights reserved. Made with <Heart className="w-4 h-4 inline text-rose-500 fill-current mx-1" /> in India.
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

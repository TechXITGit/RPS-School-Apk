// Tour step configuration for Super Admin Portal (Admin features + Super Admin privileges)
import { ADMIN_TOUR_STEPS } from './adminTourConfig.js';

export const SUPER_ADMIN_TOUR_STEPS = [
  ...ADMIN_TOUR_STEPS,
  {
    id: 'admin-nav-superadmin-mgmt',
    targetId: 'admin-nav-superadmin-mgmt',
    screen: 'dashboard',
    title: 'Admin Management',
    description: 'Create new administrator accounts, manage system permissions, and revoke or restore admin privileges.',
    hindiTitle: 'एडमिन प्रबंधन',
    hindiDesc: 'नए एडमिन खाते बनाएं, सिस्टम अनुमतियां प्रबंधित करें और आवश्यकता पड़ने पर एक्सेस रद्द या बहाल करें।',
    position: 'top',
    tooltipPosition: 'top',
  },
  {
    id: 'admin-nav-superadmin-activity',
    targetId: 'admin-nav-superadmin-activity',
    screen: 'dashboard',
    title: 'Admin Activity & Audit Logs',
    description: 'Review critical actions performed by staff and administrators with timestamps and security traces.',
    hindiTitle: 'एडमिन गतिविधि व ऑडिट लॉग',
    hindiDesc: 'स्टाफ और एडमिन द्वारा की गई महत्वपूर्ण गतिविधियों और सुरक्षा लॉग की समीक्षा करें।',
    position: 'top',
    tooltipPosition: 'top',
  },
  {
    id: 'admin-logout-btn',
    targetId: 'admin-logout-btn',
    screen: 'dashboard',
    title: 'Secure Logout',
    description: 'Logout safely from the Admin Portal when your administrative tasks are complete.',
    hindiTitle: 'सुरक्षित लॉगआउट',
    hindiDesc: 'अपना कार्य पूरा होने के बाद एडमिन पोर्टल से सुरक्षित रूप से लॉगआउट करें।',
    position: 'top',
    tooltipPosition: 'top',
  },
];

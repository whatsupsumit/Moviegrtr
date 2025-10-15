// EmailJS Configuration Test
// Run this in browser console to test your EmailJS setup

export const testEmailJSSetup = async () => {
  console.log('=== EMAILJS CONFIGURATION TEST ===');
  
  // Check environment variables
  const config = {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  };
  
  console.log('Environment Variables:');
  console.log('REACT_APP_EMAILJS_SERVICE_ID:', config.serviceId);
  console.log('REACT_APP_EMAILJS_TEMPLATE_ID:', config.templateId);
  console.log('REACT_APP_EMAILJS_PUBLIC_KEY:', config.publicKey ? 'Set (hidden)' : 'NOT SET');
  
  if (!config.serviceId || !config.templateId || !config.publicKey) {
    console.error('❌ Missing EmailJS configuration!');
    console.log('Please check your .env file has:');
    console.log('REACT_APP_EMAILJS_SERVICE_ID=service_ptezuw3');
    console.log('REACT_APP_EMAILJS_TEMPLATE_ID=template_3c5zryf');
    console.log('REACT_APP_EMAILJS_PUBLIC_KEY=37_XtPYJCDpBe5k5y');
    return false;
  }
  
  console.log('✅ All configuration values are set');
  
  // Test EmailJS package installation
  try {
    const emailjs = await import('@emailjs/browser');
    console.log('✅ @emailjs/browser package is installed');
    
    // Initialize EmailJS
    emailjs.default.init(config.publicKey);
    console.log('✅ EmailJS initialized successfully');
    
    return true;
  } catch (error) {
    console.error('❌ @emailjs/browser package not installed or error:', error);
    console.log('Run: npm install @emailjs/browser');
    return false;
  }
};

// Quick test to send email
export const sendQuickTestEmail = async (toEmail) => {
  try {
    const emailjs = await import('@emailjs/browser');
    const config = {
      serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
      templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    };
    
    emailjs.default.init(config.publicKey);
    
    const templateParams = {
      to_email: toEmail,
      to_name: 'Test User',
      from_name: 'Moviegrtr Test',
      group_name: 'Test Group',
      movie_title: 'The Matrix',
      movie_overview: 'This is a test email to verify EmailJS configuration!',
      movie_rating: '8.7'
    };
    
    console.log('Sending test email to:', toEmail);
    console.log('Template params:', templateParams);
    
    const result = await emailjs.default.send(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    console.log('✅ Test email sent successfully!', result);
    alert('Test email sent! Check your inbox at: ' + toEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    alert('Failed to send test email: ' + error.message);
    return false;
  }
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.testEmailJSSetup = testEmailJSSetup;
  window.sendQuickTestEmail = sendQuickTestEmail;
}

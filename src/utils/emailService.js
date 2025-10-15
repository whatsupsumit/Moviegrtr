// Email Notification Service using EmailJS
// Note: For production, consider using Firebase Cloud Functions with SendGrid/Mailgun

/**
 * Initialize EmailJS (Free email service)
 * Sign up at: https://www.emailjs.com/
 * Get your PUBLIC_KEY, SERVICE_ID, and TEMPLATE_ID
 */

// EmailJS configuration - these should be added to .env file
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_PROPOSAL_TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_3c5zryf';
const EMAILJS_RESPONSE_TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_3c5zryf';

// Load EmailJS library dynamically
let emailjs = null;

const loadEmailJS = async () => {
  if (emailjs) return emailjs;
  
  try {
    // Dynamically import emailjs if installed
    const module = await import('@emailjs/browser');
    emailjs = module.default;
    emailjs.init(EMAILJS_PUBLIC_KEY);
    return emailjs;
  } catch (error) {
    console.warn('EmailJS not installed. Email notifications disabled.');
    console.log('To enable email notifications:');
    console.log('1. Run: npm install @emailjs/browser');
    console.log('2. Sign up at https://www.emailjs.com/');
    console.log('3. Add your EmailJS credentials to .env file');
    return null;
  }
};

/**
 * Send email notification when a movie is proposed to a group
 * @param {Object} proposal - Proposal object
 * @param {Array} groupMembers - Array of group member objects
 * @param {string} groupName - Name of the group (optional)
 */
export const sendProposalNotification = async (proposal, groupMembers, groupName = 'Your Group') => {
  try {
    const emailJSClient = await loadEmailJS();
    if (!emailJSClient) {
      // Fallback: Log to console
      console.log('📧 EMAIL NOTIFICATION (Demo Mode):');
      console.log(`Movie Proposal: ${proposal.movieTitle}`);
      console.log(`Proposed by: ${proposal.proposedByName}`);
      console.log(`Group: ${groupName}`);
      console.log(`Group members to notify:`, groupMembers.map(m => m.email));
      return { success: true, mode: 'demo' };
    }

    // Send email to each group member (except the proposer)
    const emailPromises = groupMembers
      .filter(member => member.email !== proposal.proposedByEmail)
      .map(member => {
        const templateParams = {
          to_email: member.email,
          to_name: member.displayName || member.email,
          from_name: proposal.proposedByName,
          group_name: groupName,
          movie_title: proposal.movieTitle,
          movie_overview: proposal.movieOverview || 'Check out this movie!',
          movie_rating: proposal.movieRating || 'N/A'
        };

        return emailJSClient.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_PROPOSAL_TEMPLATE,
          templateParams
        );
      });

    await Promise.all(emailPromises);
    console.log('Proposal notifications sent successfully');
    return { success: true, mode: 'email', count: emailPromises.length };
  } catch (error) {
    console.error('Error sending proposal notifications:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification when someone responds "yes" to a proposal
 * @param {Object} proposal - Proposal object with updated responses
 * @param {Object} responder - User who responded
 */
export const sendResponseNotification = async (proposal, responder) => {
  try {
    const emailJSClient = await loadEmailJS();
    if (!emailJSClient) {
      // Fallback: Log to console
      console.log('📧 EMAIL NOTIFICATION (Demo Mode):');
      console.log(`${responder.displayName} said YES to "${proposal.movieTitle}"`);
      console.log(`Notify proposer: ${proposal.proposedByEmail}`);
      return { success: true, mode: 'demo' };
    }

    // Get all members who said yes
    const yesResponders = proposal.responses?.filter(r => r.response === true) || [];
    
    // Send to proposer
    const proposerEmail = {
      to_email: proposal.proposedByEmail,
      to_name: proposal.proposedByName,
      responder_name: responder.displayName || responder.email,
      movie_title: proposal.movieTitle,
      yes_count: yesResponders.length,
      total_responses: proposal.responses?.length || 0
    };

    await emailJSClient.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_RESPONSE_TEMPLATE,
      proposerEmail
    );

    // Also notify other "yes" responders
    const otherYesEmails = yesResponders
      .filter(r => r.email !== responder.email && r.email !== proposal.proposedByEmail)
      .map(r => {
        const templateParams = {
          to_email: r.email,
          to_name: r.displayName || r.email,
          responder_name: responder.displayName || responder.email,
          movie_title: proposal.movieTitle,
          yes_count: yesResponders.length,
          total_responses: proposal.responses?.length || 0
        };

        return emailJSClient.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_RESPONSE_TEMPLATE,
          templateParams
        );
      });

    await Promise.all(otherYesEmails);
    console.log('Response notifications sent successfully');
    return { success: true, mode: 'email', count: otherYesEmails.length + 1 };
  } catch (error) {
    console.error('Error sending response notifications:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a test email to verify configuration
 * @param {string} testEmail - Email address to send test to
 */
export const sendTestEmail = async (testEmail) => {
  try {
    const emailJSClient = await loadEmailJS();
    if (!emailJSClient) {
      alert('EmailJS not configured. Check console for setup instructions.');
      return false;
    }

    const templateParams = {
      to_email: testEmail,
      to_name: 'Test User',
      from_name: 'Moviegrtr Team',
      movie_title: 'The Matrix',
      movie_overview: 'This is a test email from your movie recommendation system!',
      movie_rating: '8.7',
      response_link: window.location.origin
    };

    await emailJSClient.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_PROPOSAL_TEMPLATE,
      templateParams
    );

    alert('Test email sent successfully! Check your inbox.');
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    alert(`Failed to send test email: ${error.message}`);
    return false;
  }
};

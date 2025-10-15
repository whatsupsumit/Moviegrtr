// Group Management Service using Firebase Firestore
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  arrayUnion,
  arrayRemove,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Create a new group
 * @param {string} groupName - Name of the group
 * @param {Array} memberEmails - Array of member email addresses
 * @returns {Object} - Created group object
 */
export const createGroup = async (groupName, memberEmails = []) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const groupRef = doc(db, 'groups', groupId);

    const groupData = {
      groupId,
      name: groupName,
      createdBy: user.uid,
      createdByEmail: user.email,
      members: [
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          role: 'admin',
          joinedAt: Date.now()
        }
      ],
      invitedEmails: memberEmails,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    };

    await setDoc(groupRef, groupData);
    console.log('Group created:', groupId);
    return { id: groupId, ...groupData };
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

/**
 * Get all groups for the current user
 * @returns {Array} - Array of groups
 */
export const getUserGroups = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const groupsRef = collection(db, 'groups');
    const snapshot = await getDocs(groupsRef);
    
    const userGroups = [];
    snapshot.forEach((doc) => {
      const groupData = doc.data();
      // Check if user is a member or invited
      const isMember = groupData.members?.some(m => m.uid === user.uid);
      const isInvited = groupData.invitedEmails?.includes(user.email);
      
      if (isMember || isInvited) {
        userGroups.push({ id: doc.id, ...groupData });
      }
    });

    return userGroups;
  } catch (error) {
    console.error('Error getting user groups:', error);
    return [];
  }
};

/**
 * Add a member to a group
 * @param {string} groupId - Group ID
 * @param {string} userEmail - Email of user to add
 */
export const addMemberToGroup = async (groupId, userEmail) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      invitedEmails: arrayUnion(userEmail),
      lastActivity: serverTimestamp()
    });

    console.log('Member invited to group:', userEmail);
  } catch (error) {
    console.error('Error adding member to group:', error);
    throw error;
  }
};

/**
 * Propose a movie to a group
 * @param {string} groupId - Group ID
 * @param {Object} movie - Movie object to propose
 * @returns {Object} - Proposal object
 */
export const proposeMovieToGroup = async (groupId, movie) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const proposalId = `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const proposalRef = doc(db, 'movieProposals', proposalId);

    const proposalData = {
      proposalId,
      groupId,
      movieId: movie.id,
      movieTitle: movie.title || movie.name,
      moviePoster: movie.poster_path,
      movieOverview: movie.overview,
      movieRating: movie.vote_average,
      proposedBy: user.uid,
      proposedByEmail: user.email,
      proposedByName: user.displayName || user.email,
      responses: [],
      yesCount: 0,
      noCount: 0,
      status: 'pending', // pending, approved, rejected
      createdAt: serverTimestamp()
    };

    await setDoc(proposalRef, proposalData);

    // Update group's last activity
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      lastActivity: serverTimestamp()
    });

    console.log('Movie proposed to group:', proposalId);
    return { id: proposalId, ...proposalData };
  } catch (error) {
    console.error('Error proposing movie to group:', error);
    throw error;
  }
};

/**
 * Respond to a movie proposal
 * @param {string} proposalId - Proposal ID
 * @param {boolean} response - true for yes, false for no
 */
export const respondToProposal = async (proposalId, response) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const proposalRef = doc(db, 'movieProposals', proposalId);
    const proposalDoc = await getDoc(proposalRef);

    if (!proposalDoc.exists()) {
      throw new Error('Proposal not found');
    }

    const proposalData = proposalDoc.data();
    
    // Check if user already responded
    const existingResponse = proposalData.responses?.find(r => r.uid === user.uid);
    
    if (existingResponse) {
      // Update existing response
      const updatedResponses = proposalData.responses.map(r => 
        r.uid === user.uid ? { ...r, response, respondedAt: Date.now() } : r
      );
      
      const yesCount = updatedResponses.filter(r => r.response === true).length;
      const noCount = updatedResponses.filter(r => r.response === false).length;

      await updateDoc(proposalRef, {
        responses: updatedResponses,
        yesCount,
        noCount
      });
    } else {
      // Add new response
      const newResponse = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        response,
        respondedAt: Date.now()
      };

      await updateDoc(proposalRef, {
        responses: arrayUnion(newResponse),
        yesCount: response ? (proposalData.yesCount || 0) + 1 : proposalData.yesCount || 0,
        noCount: !response ? (proposalData.noCount || 0) + 1 : proposalData.noCount || 0
      });
    }

    console.log('Response recorded:', response ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('Error responding to proposal:', error);
    throw error;
  }
};

/**
 * Get all proposals for a group
 * @param {string} groupId - Group ID
 * @returns {Array} - Array of proposals
 */
export const getGroupProposals = async (groupId) => {
  try {
    const proposalsRef = collection(db, 'movieProposals');
    const q = query(proposalsRef, where('groupId', '==', groupId));
    const snapshot = await getDocs(q);

    const proposals = [];
    snapshot.forEach((doc) => {
      proposals.push({ id: doc.id, ...doc.data() });
    });

    return proposals.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting group proposals:', error);
    return [];
  }
};

/**
 * Get all proposals for current user
 * @returns {Array} - Array of proposals
 */
export const getUserProposals = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    // Get user's groups
    const userGroups = await getUserGroups();
    const groupIds = userGroups.map(g => g.id || g.groupId);

    // Get all proposals for these groups
    const allProposals = [];
    for (const groupId of groupIds) {
      const proposals = await getGroupProposals(groupId);
      allProposals.push(...proposals);
    }

    return allProposals;
  } catch (error) {
    console.error('Error getting user proposals:', error);
    return [];
  }
};

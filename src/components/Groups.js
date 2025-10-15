import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  getUserGroups, 
  createGroup, 
  getUserProposals, 
  respondToProposal,
  getGroupProposals 
} from '../utils/groupService';
import { sendProposalNotification, sendResponseNotification } from '../utils/emailService';
import { auth } from '../utils/firebase';

const Groups = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' or 'proposals'

  useEffect(() => {
    loadData();
    
    // Check if redirected from a proposal link
    const proposalId = searchParams.get('proposal');
    if (proposalId) {
      setActiveTab('proposals');
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userGroups, userProposals] = await Promise.all([
        getUserGroups(),
        getUserProposals()
      ]);
      setGroups(userGroups);
      setProposals(userProposals);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    console.log('=== CREATE GROUP STARTED ===');
    console.log('Group Name:', newGroupName);
    console.log('Member Emails:', memberEmails);
    console.log('Current User:', auth.currentUser);
    
    if (!auth.currentUser) {
      alert('You must be logged in to create a group!');
      return;
    }
    
    if (!newGroupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    
    try {
      const emails = memberEmails.split(',').map(e => e.trim()).filter(e => e);
      console.log('Processed emails:', emails);
      
      console.log('Calling createGroup...');
      const result = await createGroup(newGroupName.trim(), emails);
      console.log('Group created successfully:', result);
      
      setShowCreateModal(false);
      setNewGroupName('');
      setMemberEmails('');
      
      console.log('Reloading data...');
      await loadData();
      
      alert('Group created successfully! 🎉');
      console.log('=== CREATE GROUP COMPLETED ===');
    } catch (error) {
      console.error('=== CREATE GROUP ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to create group: ${error.message}`);
    }
  };

  const handleResponse = async (proposal, response) => {
    try {
      await respondToProposal(proposal.id || proposal.proposalId, response);
      
      // Send email notification if response is "yes"
      if (response) {
        const currentUser = auth.currentUser;
        const responder = {
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email
        };
        await sendResponseNotification(proposal, responder);
      }
      
      loadData();
      alert(`You ${response ? 'accepted' : 'declined'} the proposal!`);
    } catch (error) {
      console.error('Error responding to proposal:', error);
      alert('Failed to record response. Please try again.');
    }
  };

  const getUserResponse = (proposal) => {
    const currentUser = auth.currentUser;
    const response = proposal.responses?.find(r => r.uid === currentUser?.uid);
    return response?.response;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="font-['JetBrains_Mono',monospace] text-white text-lg">
            Loading groups...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Movie Groups
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-['JetBrains_Mono',monospace] px-6 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Group
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('groups')}
            className={`font-['JetBrains_Mono',monospace] px-4 py-2 transition-colors ${
              activeTab === 'groups'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Groups ({groups.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`font-['JetBrains_Mono',monospace] px-4 py-2 transition-colors ${
              activeTab === 'proposals'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Movie Proposals ({proposals.length})
          </button>
        </div>

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div>
            {groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                  <div
                    key={group.id || group.groupId}
                    className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-red-500 transition-colors"
                  >
                    <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold mb-2">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Created by: {group.createdByEmail}
                    </p>
                    <div className="flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {group.members?.length || 0} members
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="font-['JetBrains_Mono',monospace] text-xl mb-2">
                  No groups yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create a group to start sharing movie recommendations with friends!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white font-['JetBrains_Mono',monospace] px-8 py-3 rounded-lg transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Group
                </button>
              </div>
            )}
          </div>
        )}

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div>
            {proposals.length > 0 ? (
              <div className="space-y-4">
                {proposals.map((proposal) => {
                  const userResponse = getUserResponse(proposal);
                  const isProposer = auth.currentUser?.uid === proposal.proposedBy;
                  
                  return (
                    <div
                      key={proposal.id || proposal.proposalId}
                      className="bg-gray-900 rounded-lg p-6 border border-gray-800"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Movie Poster */}
                        {proposal.moviePoster && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${proposal.moviePoster}`}
                            alt={proposal.movieTitle}
                            className="w-24 h-36 object-cover rounded"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold mb-1">
                            {proposal.movieTitle}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            Proposed by {proposal.proposedByName}
                          </p>
                          {proposal.movieOverview && (
                            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                              {proposal.movieOverview}
                            </p>
                          )}
                          
                          {/* Voting Stats */}
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center text-green-500">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {proposal.yesCount || 0} Yes
                            </div>
                            <div className="flex items-center text-red-500">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              {proposal.noCount || 0} No
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {!isProposer && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleResponse(proposal, true)}
                                disabled={userResponse === true}
                                className={`px-4 py-2 rounded font-['JetBrains_Mono',monospace] text-sm transition-colors ${
                                  userResponse === true
                                    ? 'bg-green-600 text-white cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                              >
                                {userResponse === true ? '✓ Accepted' : 'Accept'}
                              </button>
                              <button
                                onClick={() => handleResponse(proposal, false)}
                                disabled={userResponse === false}
                                className={`px-4 py-2 rounded font-['JetBrains_Mono',monospace] text-sm transition-colors ${
                                  userResponse === false
                                    ? 'bg-gray-700 text-white cursor-not-allowed'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                                }`}
                              >
                                {userResponse === false ? '✗ Declined' : 'Decline'}
                              </button>
                            </div>
                          )}
                          {isProposer && (
                            <div className="text-sm text-gray-400 italic">
                              You proposed this movie
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="font-['JetBrains_Mono',monospace] text-xl mb-2">
                  No movie proposals yet
                </h3>
                <p className="text-gray-400">
                  When your group members propose movies, they'll appear here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              // Close modal if clicking outside
              if (e.target === e.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          >
            <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-gray-800" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold mb-6">
                Create New Group
              </h2>
              <form onSubmit={handleCreateGroup} id="createGroupForm">
                <div className="mb-4">
                  <label className="block text-sm font-['JetBrains_Mono',monospace] mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-500 text-white"
                    placeholder="Movie Night Crew"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-['JetBrains_Mono',monospace] mb-2">
                    Member Emails (comma-separated)
                  </label>
                  <textarea
                    value={memberEmails}
                    onChange={(e) => setMemberEmails(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-500 h-24 text-white"
                    placeholder="friend1@email.com, friend2@email.com"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Optional: Invite members by email
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-['JetBrains_Mono',monospace] px-4 py-2 rounded transition-colors cursor-pointer font-bold"
                    style={{ pointerEvents: 'auto' }}
                  >
                    CREATE GROUP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Cancel clicked');
                      setShowCreateModal(false);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-['JetBrains_Mono',monospace] px-4 py-2 rounded transition-colors cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;

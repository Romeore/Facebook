import React, { useEffect, useState } from "react";
import {
  fetchGroups,
  createGroup,
  joinGroup,
  getGroupMembers,
  approveMember,
  removeMember,
  leaveGroup,
  transferAdminAndLeave,
  deleteGroup
} from "../controllers/groupController";
import "./GroupsView.css";

function GroupsView({ username }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminSettingsShown, setAdminSettingsShown] = useState({});

  useEffect(() => {
    fetchGroups(username).then(setGroups);
  }, [username]);

  const handleCreate = async () => {
    const name = form.name.trim();
    const desc = form.description.trim();

    if (!name || !desc) {
      alert("Please fill in both the group name and description.");
      return;
    }

    await createGroup({ name: name, description: desc }, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
    setForm({ name: "", description: "" });
  };


  const handleJoin = async (groupId) => {
    await joinGroup(groupId, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
  };

  const handleViewMembers = async (groupId) => {
    const groupMembers = await getGroupMembers(groupId, username);
    setSelectedGroupId(groupId);
    setMembers(groupMembers);
  };

  const handleApprove = async (groupId, user) => {
    await approveMember(groupId, user, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
  };

  const handleRemoveMember = async (groupId, user) => {
    await removeMember(groupId, user, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
    if (groupId === selectedGroupId) handleViewMembers(groupId);
  };

  const handleLeaveGroup = async (groupId) => {
    await leaveGroup(groupId, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
    if (groupId === selectedGroupId) {
      setSelectedGroupId(null);
      setMembers([]);
    }
  };

  const handleTransferAndLeave = async (groupId) => {
    if (!newAdminUsername) {
      alert("Select a new admin before transferring ownership.");
      return;
    }
    await transferAdminAndLeave(groupId, newAdminUsername, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
    if (groupId === selectedGroupId) {
      setSelectedGroupId(null);
      setMembers([]);
    }
    setNewAdminUsername("");
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      await deleteGroup(groupId, username);
      const updated = await fetchGroups(username);
      setGroups(updated);
      if (groupId === selectedGroupId) {
        setSelectedGroupId(null);
        setMembers([]);
      }
    }
  };

  return (
    <div className="groups-container">
      <h2>Groups</h2>

      <div className="group-create">
        <h4>Create Group</h4>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <button className="main-button" onClick={handleCreate}>Create</button>
      </div>

      <hr />

      <h4>Available Groups</h4>
      <input
        type="text"
        placeholder="Search group name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="group-search"
      />

      <div className="group-list">
        {groups
          .filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(group => (
            <div key={group._id} className="group-card">
              <strong>{group.name}</strong> – {group.description}
              <p>Admin: {group.admin}</p>
              <p>Members: {group.members.length}</p>

              {!group.members.includes(username) &&
                !group.pending?.includes(username) &&
                <button className="main-button" onClick={() => handleJoin(group._id)}>Request to Join</button>}

              {group.members.includes(username) && (
                <>
                  <button className="main-button" onClick={() => handleViewMembers(group._id)}>View Members</button>
                  {group.admin !== username && (
                    <button className="main-button" onClick={() => handleLeaveGroup(group._id)}>Leave Group</button>
                  )}
                </>
              )}

              {selectedGroupId === group._id && (
                <ul>
                  <strong>Members:</strong>
                  {members.map((m, i) => (
                    <li key={i}>
                      {m}
                      {group.admin === username && m !== group.admin && (
                        <button className="main-button" onClick={() => handleRemoveMember(group._id, m)}>Remove</button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {group.admin === username && group.pending?.length > 0 && (
                <>
                  <p><strong>Pending Requests:</strong></p>
                  <ul>
                    {group.pending.map((pendingUser, i) => (
                      <li key={i} className="pending-request-item">
                        <span className="pending-username">{pendingUser}</span>
                        <button className="main-button" onClick={() => handleApprove(group._id, pendingUser)}>Approve</button>
                        <button className="main-button" onClick={() => handleRemoveMember(group._id, pendingUser)}>Reject</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {group.admin === username && (
                <>
                  <button
                    className="admin-toggle-btn"
                    onClick={() =>
                      setAdminSettingsShown(prev => ({
                        ...prev,
                        [group._id]: !prev[group._id]
                      }))
                    }
                  >
                    {adminSettingsShown[group._id] ? "Hide Admin Settings" : "Admin Settings"}
                  </button>
                </>
              )}

              {adminSettingsShown[group._id] && group.admin === username && (
                <>
                  {group.members.length > 1 && (
                    <div className="transfer-section">
                      <div className="transfer-label">Transfer ownership or delete group:</div>
                      <div className="transfer-block">
                        <select
                          value={newAdminUsername}
                          onChange={e => setNewAdminUsername(e.target.value)}
                        >
                          <option value="">-- Select new admin --</option>
                          {group.members
                            .filter(m => m !== group.admin)
                            .map((m, i) => (
                              <option key={i} value={m}>{m}</option>
                            ))}
                        </select>
                        <button onClick={() => handleTransferAndLeave(group._id)}>
                          Transfer & Leave
                        </button>
                      </div>
                    </div>
                  )}



                  <br />
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    className="delete-button"
                  >
                    Delete Group
                  </button>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default GroupsView;

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

function GroupsView({ username }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ⬅️ Added for search

  useEffect(() => {
    fetchGroups(username).then(setGroups);
  }, [username]);

  const handleCreate = async () => {
    await createGroup(form, username);
    const updated = await fetchGroups(username);
    setGroups(updated);
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
    if (groupId === selectedGroupId) {
      handleViewMembers(groupId);
    }
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
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
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
    <div>
      <h2>Groups</h2>

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
      <button onClick={handleCreate}>Create</button>

      <hr />

      <h4>Available Groups</h4>

      <input
        type="text"
        placeholder="Search group name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
      />

      <ul>
        {groups
          .filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(group => (
            <li key={group._id} style={{ marginBottom: "1.5rem" }}>
              <strong>{group.name}</strong> – {group.description} <br />
              Admin: {group.admin} <br />
              Members: {group.members.length}
              <br />

              {!group.members.includes(username) &&
                !group.pending?.includes(username) &&
                <button onClick={() => handleJoin(group._id)}>Request to Join</button>}

              {group.members.includes(username) && (
                <>
                  <button onClick={() => handleViewMembers(group._id)}>View Members</button>
                  {group.admin !== username && (
                    <button onClick={() => handleLeaveGroup(group._id)}>Leave Group</button>
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
                        <button onClick={() => handleRemoveMember(group._id, m)}>Remove</button>
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
                      <li key={i}>
                        {pendingUser}
                        <button onClick={() => handleApprove(group._id, pendingUser)}>Approve</button>
                        <button onClick={() => handleRemoveMember(group._id, pendingUser)}>Reject</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {group.admin === username && group.members.length > 1 && (
                <>
                  <p><strong>Transfer Ownership & Leave:</strong></p>
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
                </>
              )}

              {group.admin === username && (
                <>
                  <br />
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      marginTop: "10px"
                    }}
                  >
                    Delete Group
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default GroupsView;

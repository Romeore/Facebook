import React, { useEffect, useState } from "react";
import {
  fetchGroups,
  createGroup,
  joinGroup,
  getGroupMembers,
  approveMember,
  removeMember
} from "../controllers/groupController";

function GroupsView({ username }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", isPrivate: false });

  useEffect(() => {
    fetchGroups(username).then(setGroups);
  }, [username]);

  const handleCreate = async () => {
    await createGroup(form, username);
    setForm({ name: "", description: "", isPrivate: false });
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
      <label>
        <input
          type="checkbox"
          checked={form.isPrivate}
          onChange={e => setForm({ ...form, isPrivate: e.target.checked })}
        />
        Private Group
      </label>
      <button onClick={handleCreate}>Create</button>

      <hr />

      <h4>Available Groups</h4>
      <ul>
        {groups.map(group => (
          <li key={group._id} style={{ marginBottom: "1.5rem" }}>
            <strong>{group.name}</strong> – {group.description} <br />
            Admin: {group.admin} <br />
            Members: {group.members.length}
            <br />

            {!group.members.includes(username) &&
              !group.pending?.includes(username) &&
              <button onClick={() => handleJoin(group._id)}>Request to Join</button>}

            {group.members.includes(username) && (
              <button onClick={() => handleViewMembers(group._id)}>View Members</button>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupsView;

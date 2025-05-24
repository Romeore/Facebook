import React, { useEffect, useState } from "react";
import {
  fetchGroups,
  createGroup,
  joinGroup,
  getGroupMembers
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
          <li key={group._id}>
            <strong>{group.name}</strong> – {group.description} <br />
            Admin: {group.admin} <br />
            Members: {group.members.length}
            <br />
            {!group.members.includes(username) && (
              <button onClick={() => handleJoin(group._id)}>Join</button>
            )}
            <button onClick={() => handleViewMembers(group._id)}>View Members</button>
            {selectedGroupId === group._id && (
              <ul>
                {members.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupsView;

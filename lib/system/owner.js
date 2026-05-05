import fs from 'fs';

const fileUrl = new URL('./owners.json', import.meta.url);

function load() {
  try {
    const data = fs.readFileSync(fileUrl);
    return JSON.parse(data.toString());
  } catch (e) {
    return [];
  }
}

function save(list) {
  try {
    fs.writeFileSync(fileUrl, JSON.stringify(list, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export function getOwners() {
  return load();
}

export function isOwnerLid(jid) {
  const owners = load();
  return owners.includes(jid);
}

export function addOwner(jid) {
  const owners = load();
  if (!owners.includes(jid)) {
    owners.push(jid);
    return save(owners);
  }
  return false;
}

export function delOwner(jid) {
  const owners = load();
  const idx = owners.indexOf(jid);
  if (idx !== -1) {
    owners.splice(idx, 1);
    return save(owners);
  }
  return false;
}

export default {
  getOwners,
  isOwnerLid,
  addOwner,
  delOwner
};

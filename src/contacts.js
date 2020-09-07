
const uuid = require("uuid").v4;
const fs = require('fs');
const path = require('path');


const { promises: fsPromise } = fs;
const contactsPath = path.join(__dirname, 'db', 'contacts.json');



async function listContacts() {
  const data = await fsPromise.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}


async function getContactById(contactId) {
  const data = await fsPromise.readFile(contactsPath, "utf-8");
  return JSON.parse(data).find(({ id }) => id === contactId);
}

async function removeContact(contactId) {
  const data = await listContacts();
  const dataId = await data.findIndex(({ id }) => id === contactId);

  if (dataId === -1) {
    return false;
  } else {
    const newList = data.filter(({ id }) => id !== contactId);
    await fs.promises.writeFile(contactsPath, JSON.stringify(newList));
    return true;
  }

}


async function addContact(name, email, phone) {

  const id = uuid();
  const newContact = { id, name, email, phone };

  const data = await listContacts();
  const newListContacts = [...data, newContact];

  await fsPromise.writeFile(contactsPath, JSON.stringify(newListContacts));
  return { id, name, email, phone };
}

async function updateContact(contactId, updatedData) {
  const getContactId = await getContactById(contactId);

  if (!getContactId) {
    return;
  }
  const data = await listContacts();
  const getContactByIndex = await data.findIndex(({ id }) => id === contactId);

  if (getContactByIndex === -1) {
    return false;
  } else {
    const updatedContact = { ...getContactId, ...updatedData };
    data[getContactByIndex] = updatedContact;
    await fsPromise.writeFile(contactsPath, JSON.stringify(data));
    return updatedContact;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
}







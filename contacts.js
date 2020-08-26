
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


const fsPromise = fs.promises;
const contactsPath = path.join(__dirname, 'db', 'contacts.json');


// TODO: задокументировать каждую функцию
function listContacts() {
  readFile()
    .then(contacts => tableContacts(contacts))
    .catch((err) => console.error(err));
}

function getContactById(contactId) {
  readFile()
    .then(contacts => contacts.find(({ id }) => id === contactId))
    .then(findContacts => tableContacts(findContacts))
    .catch((err) => console.error(err));
}

function removeContact(contactId) {
  readFile()
    .then(contacts => contacts.filter(({ id }) => id !== contactId))
    .then(newContacts => {
      writeFile(newContacts)
        .catch((err) => console.error(err));
      tableContacts(newContacts);
    })
    .catch((err) => console.error(err));
}

function addContact(name, email, phone) {
  const id = uuidv4();
  const newContact = { id, name, email, phone };

  readFile()
    .then((contacts) => {
      const newContacts = [...contacts, newContact];
      writeFile(newContacts)
        .catch((err) => console.error(err));
      tableContacts(newContacts);
    })
    .catch((err) => console.error(err));
}

function readFile() {
  return fsPromise.readFile(contactsPath, 'utf8')
    .then(res => JSON.parse(res));
}

function writeFile(contact) {
  return fsPromise.writeFile(contactsPath, JSON.stringify(contact))
}

function tableContacts(contacts) {
  console.table(contacts);
}

// exports.addContact = addContact;
// exports.removeContact = removeContact;
// exports.getContactById = getContactById;
// exports.listContacts = listContacts;

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
}







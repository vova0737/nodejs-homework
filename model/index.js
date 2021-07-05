const Contact = require('./schemas/contact')

const listContacts = async (userId, query) => {
  const {
    page = 1,
    limit = 20,
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
  } = query
  const optionsSearch = { owner: userId }
  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }

  const result = await Contact.paginate(optionsSearch, {
    page,
    limit,
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  })
  const { docs: contacts, totalDocs: total } = result
  return { contacts, total, page, limit }
}

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({
    owner: userId,
    _id: contactId,
  }).populate({
    path: 'owner',
    select: 'name email subscription -_id',
  })
  return result
}

const removeContact = async (userId, contactId) => {
  const result = await Contact.findOneAndDelete({
    owner: userId,
    _id: contactId,
  })
  return result
}

const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    {
      owner: userId,
      _id: contactId,
    },
    { ...body },
    { new: true }
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

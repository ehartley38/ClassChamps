import { useEffect, useState } from 'react'
import axios from 'axios'
import peopleService from './services/persons'

const DeleteButton = ({ person, deletePerson}) => {

  return (
    <>
      <button onClick={() => deletePerson(person)}>Delete</button>
    </>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <>
      {person.name} {person.number} <DeleteButton person={person} deletePerson={deletePerson}/>
      <br></br>
    </>
  )
}

const PersonForm = ({addPerson, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <div>Name: <input value={newName} onChange={handleNameChange} /></div>
      <div>Number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const DisplayAllPeople = ({ persons, deletePerson }) => {
  return (
    persons.map(person => <Person key={person.id} person={person} deletePerson={deletePerson} />)
  )
}

const Notification = ({ message, showNotification }) => {
  if (message === null) {
    return null
  }
  if (showNotification !== false) {
    return (
      <div className='successNotification'>
        {message}
      </div>
    )
  }
  
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

useEffect(() => {
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
}, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    // If person is not duplicate, add them to persons
    const index = persons.map(person => person.name).indexOf(newName)
    if (index === -1) {
      peopleService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setShowNotification(true)
        setTimeout(() => {
          setShowNotification(false)
        }, 5000)
      })
    }
    else {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        let personObjectToUpdate = persons[index]
        peopleService
        .updateNumber(personObjectToUpdate, personObject.number)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
          setNewName('')
          setSuccessMessage(`Changed ${returnedPerson.name}'s number to ${returnedPerson.number}`)
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
          }, 5000)
        })
      }
    }
    
  
  }

  const deletePerson = (person) => {
    let id = person.id
    if (window.confirm(`Delete ${person.name}?`)) {
      peopleService
      .deleteId(id)
      .then(() => {setPersons(persons.filter(person => person.id !== id))})
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  return (
    <div>
      <Notification message={successMessage} showNotification={showNotification} />
      <h2>Phonebook</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} 
      handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
        <DisplayAllPeople persons={persons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
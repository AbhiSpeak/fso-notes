import { useState, useEffect } from 'react'
import Note from './components/Note.js'
import Notification from './components/Notification.js'
import noteService from './services/notes.js'
import axios from 'axios'
import './index.css'



const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 20,
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}



const App = () => {
  //const { notes } = props
  const[notes, setNotes] = useState([])
  const[newNote, setNewNote] = useState('')
  const[showAll, setShowAll] = useState(true)
  const[errorMessage, setErrorMessage] = useState('some error happened...')

  
  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote)
    .then(returnedNote => {setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content} was already removed`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
    

  }


  useEffect(() => {
    console.log('effect')
   noteService.getAll().then(initialNotes => {setNotes(initialNotes)})
  }, [])

  console.log('render', notes.length, 'notes')
  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,

    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification errorMessage={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note note={note} key={note.id} toggleImportance={() => toggleImportanceOf(note.id)}/>)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
          onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer /> 
    </div>
  )
}

export default App
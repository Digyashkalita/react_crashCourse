import Header from "./components/Header.js"
import Tasks from './components/Tasks.js'
import AddTask from './components/AddTask.js'
import React from 'react'
import {useState, useEffect} from 'react'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks]  = useState( [])

  useEffect(() => {
    const getTasks = async () =>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
      }
      getTasks()
  }, [])

  //fetch tasks from server
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data;
  }
  //fetch task from server
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data;
  }

//Add Task
const addTask =async  (task) =>{
  const res = await fetch('http://localhost:5000/tasks',{
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()

  setTasks([...tasks, data])
  //   const id = Math.floor(Math.random()*10000)+1
//   const newTask = {id, ...task}
//   setTasks([...tasks, newTask])
// 
}


//Delete task
  const deleteTask = async (id) => {
      await fetch( `http://localhost:5000/tasks/${id}`,{
        method: 'DELETE'
      })

    setTasks(tasks.filter((task)=> task.id !==id)) //setTasks updates the list with the tasks without  updating the tasks which task.id is === id(that means the deleted task is not updated by the setTask func ) 
  }

// Toggle reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updTask = {...taskToToggle, 
    reminder: !taskToToggle.reminder } 

  const res = await fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask),
  })

  const data = await res.json()
  setTasks(
    tasks.map((task) =>
    task.id ===id ? {...task, reminder: data.reminder} : task)
  )
}

  return (
    <div className="container">
    <Header onAdd={() => setShowAddTask (!showAddTask)} showAdd={showAddTask}/>
    {showAddTask && <AddTask onAdd={addTask}/>}
    { tasks.length > 0 ?(<Tasks tasks={tasks} onDelete = {deleteTask} onToggle = {toggleReminder}/>) : ("No Tasks To Show")}
    </div>
  );
}


export default App;

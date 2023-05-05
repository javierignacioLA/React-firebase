import './App.css';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';


function App() {

  const [tareas, setTareas] = useState ([])
  const [tarea, setTarea] = useState ('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState (' ')

  useEffect(() =>{
    obtenerDatos()
  }, [])

  const obtenerDatos = async () => {
    try {
      const datos = await getDocs (collection(db, 'tareas'))
      //console.log (datos.docs)
      /*forma 1
      const arrayDatos = datos.docs.map (doc=> ({id: doc.id, info: doc.data()}))
      console.log(arrayDatos.map(doc => doc.info.fecha))
      */
      //forma 2
      const arrayDatos = datos.docs.map (item => ({id: item.id, ...item.data()}))
      console.log(arrayDatos)
      setTareas (arrayDatos)

    }catch (error){
      console.log(error)
    } 
  }
  const agregar = async (e) =>{
    e.preventDefault()
    //validacion
    if (!tarea.trim()){
      console.log ("no hay nada")
      return
    }
    console.log(tarea)
    try{
      /*const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }
      */
      //const data = await addDoc (collection(db, 'tareas'), {nuevaTarea})
       const data = await addDoc (collection(db, 'tareas'), {name: tarea, fecha: Date.now()})
      setTareas ([...tareas,{id: data.id, name:tarea, fecha:Date.now()}])
      setTarea('')
      
    }catch (error){
      console.log (error)
    }
  }
  const eliminar = async (id) => {
    try{
      await deleteDoc(doc(db, "tareas", id));
      const filtrarArray = tareas.filter (task => task.id !== id)
      setTareas(filtrarArray)
    }catch (error){
      console.log (error)
    }
  }
  const activarEdicion = (task) =>{
    setModoEdicion(true)
    setTarea (task.name)
    setId(task.id)
  }
  const editar = async (e) => {
    e.preventDefault()
    //validacion
    if (!tarea.trim()){
      console.log ("no hay nada")
      return
    }
    console.log(tarea)
   try{
     /*forma 1 
    const tareaActualizar = doc (db, 'tareas', id)
    await updateDoc (tareaActualizar, {
      name: tarea
    })
    */
   //forma 2
   await updateDoc (doc(db, 'tareas', id), {
    name: tarea
  })
  const arrayEditado = tareas.map (task => (task.id ===id ? {id: task.id, fecha: task.fecha, name: tarea}: task))
  setTareas(arrayEditado)
  setModoEdicion(false)
  setId(' ')
  setTarea (' ')
   }catch (error){
    console.log (error)
   }

  }

  return (
    <div className="container mt-3">
      <div className='row'>
        <div className='col-md-6'>
          <h3>Lista de tareas</h3>
          <ul className='list-group'>
            {tareas.map(task => 
              <li className='list-group-item mr-2 ' key={task.id} > 
              {task.name} 
              <button className='btn btn-danger btn-sm float-right '
              onClick={() => eliminar(task.id)}>
                Eliminar
                </button>
                <button className='btn btn-warning btn-sm float-right mr-2'
                onClick={() => activarEdicion(task)}>
                  Editar
                </button> 
              </li>
            )}
          </ul>
        </div>
        <div className='col-md-6'>
          <h3>{modoEdicion? 'Editar Tarea': 'Agregar Tarea'}</h3>
          <form onSubmit={modoEdicion? editar: agregar}>
            <input
              type= "text"
              className='form-control mb-2'
              placeholder='Ingresa tarea'
              value={tarea}
              onChange={e => setTarea(e.target.value)}
            />
            <button 
            className={modoEdicion? 'btn btn-warning btn-block': 'btn btn-dark btn-block'} >
              {modoEdicion? 'Editar': 'Agregar'}
              </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default App;

import axios from 'axios'
import React, { useState } from 'react'

const AddNewTaskForm = (props) => {
  const [inputValue, setInputValue] = useState('')
  const onInputValueChange = (e) => {
    setInputValue(e.target.value)
  }

  const onAddButtonClick = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `/api/v1/tasks/${props.category}`,
        {
          title: inputValue,
        },
        { headers: { "content-type": "application/json" } }
      );
      const updatedData = res.data
      setInputValue('')
      props.setTasksList(updatedData)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="sm:my-6 my-3 box-content mx-6 sm:w-1/3">
      <label htmlFor="createNewTask" className="sr-only">
        Create a new task
      </label>
      <form>
        <input
          name="createNewTask"
          className="rounded-l w-2/3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-700 focus:border-blue-700 focus:z-10 text-sm"
          value={inputValue}
          placeholder="Create a new task"
          onChange={onInputValueChange}
        />
        <button
          type="submit"
          disabled={inputValue === "" || inputValue === " "}
          onClick={onAddButtonClick}
          className="justify-center py-2 w-1/3 px-4 border border-transparent text-sm font-medium rounded-r text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Add
        </button>
      </form>
    </div>
  );
}
export default AddNewTaskForm

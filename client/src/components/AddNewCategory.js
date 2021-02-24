import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const AddNewCategory = () => {
  const [inputValue, setInputValue] = useState('')

  const onInputValueChange = (e) => {
    setInputValue(e.target.value)
  }

  const history = useHistory()

  const [error, setError] = useState(false)

  const onAddButtonClick = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/v1/tasks/${inputValue}`)
      await history.push(`/${inputValue}`)
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  return (
    <div className="relative w-1/2 mt-6">
      <label htmlFor="createNewTask" className="sr-only">
        Create a new task category
      </label>
      <form onSubmit={onAddButtonClick}>
        <input
          name="createNewTask"
          className="rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          value={inputValue}
          placeholder="Create a new task category"
          onChange={onInputValueChange}
        />
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 mt-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add
        </button>
        {error && (
          <div className="text-red-500 text-xs">Category is already exist</div>
        )}
      </form>
    </div>
  );
}

export default AddNewCategory

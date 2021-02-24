import React, { useState } from 'react'
import axios from 'axios'
import ChangeTaskStatusButton from './ChangeStatusButton'
import * as STATUSES from './appConst'

const Task = (props) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [titleValueEditMode, setTitleValueEditMode] = useState(props.taskData.title)
  const [titleValue, setTitleValue] = useState(props.taskData.title)

  const DONE_STATUS_CLASS = 'bg-green-100 text-green-800'
  const NEW_STATUS_CLASS = 'bg-blue-100 text-blue-800'
  const IN_PROGRESS_STATUS_CLASS = 'bg-yellow-100 text-yellow-800'
  const BLOCKED_STATUS_CLASS = 'bg-red-100 text-red-800'
  const DEFAULT_STATUS_CLASS = 'bg-grey-100 text-grey-800'

  let statusClass

  switch (props.taskData.status) {
    case STATUSES.DONE:
      statusClass = DONE_STATUS_CLASS
      break
    case STATUSES.IN_PROGRESS:
      statusClass = IN_PROGRESS_STATUS_CLASS
      break
    case STATUSES.BLOCKED:
      statusClass = BLOCKED_STATUS_CLASS
      break
    case STATUSES.NEW:
      statusClass = NEW_STATUS_CLASS
      break
    default:
      statusClass = DEFAULT_STATUS_CLASS
      break
  }

  const onEditTitleButtonClick = async () => {
    setIsEditMode(!isEditMode)
    try {
      const response = await axios.patch(
        `/api/v1/tasks/${props.category}/${props.taskData.taskId}`,
        {
          title: titleValueEditMode
        },
        { headers: { 'content-type': 'application/json' } }
      )
      setTitleValueEditMode(response.data.title)
      setTitleValue(response.data.title)
    } catch (err) {
      console.error(err)
    }
  }

  const onInputChange = (e) => {
    setTitleValueEditMode(e.target.value)
  }

  return (
    <tr className="w-full flex items-center px-3 py-2 justify-between">
      <td className="w-6/12">
        <div className="flex items-center">
          <div className="sm:ml-4">
            {isEditMode ? (
              <input
                className="text-base w-full leading-5 py-1 px-1 cursor-text border rounded border-gray-300 font-medium text-gray-900"
                onChange={onInputChange}
                value={titleValueEditMode}
              />
            ) : (
              <div className="text-base leading-5 font-medium text-gray-900">
                {titleValue}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="w-4/12 px-2 py-2">
        <span
          className={`px-2 text-base leading-5 font-semibold rounded-full ${statusClass}`}
        >
          {props.taskData.status}
        </span>
        {props.taskData.status === "new" && (
          <ChangeTaskStatusButton
            buttonName="In Progress"
            moveToCategory={STATUSES.IN_PROGRESS}
            category={props.category}
            taskId={props.taskData.taskId}
            onChangeTaskStatusButtonsClick={
              props.onChangeTaskStatusButtonsClick
            }
          />
        )}
        {props.taskData.status === "in progress" && (
          <>
            <ChangeTaskStatusButton
              buttonName="Blocked"
              moveToCategory={STATUSES.BLOCKED}
              category={props.category}
              taskId={props.taskData.taskId}
              onChangeTaskStatusButtonsClick={
                props.onChangeTaskStatusButtonsClick
              }
            />
            <ChangeTaskStatusButton
              buttonName="Done"
              moveToCategory={STATUSES.DONE}
              category={props.category}
              taskId={props.taskData.taskId}
              onChangeTaskStatusButtonsClick={
                props.onChangeTaskStatusButtonsClick
              }
            />
          </>
        )}
        {props.taskData.status === "blocked" && (
          <ChangeTaskStatusButton
            buttonName="In Progress"
            moveToCategory={STATUSES.IN_PROGRESS}
            category={props.category}
            taskId={props.taskData.taskId}
            onChangeTaskStatusButtonsClick={
              props.onChangeTaskStatusButtonsClick
            }
          />
        )}
      </td>
      <td className="w-2/12">
        <button
          type="button"
          onClick={onEditTitleButtonClick}
          className="items-center md:w-12 w-full px-1 py-1 ml-1 border border-gray-300 leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
        >
          {isEditMode ? "Save" : "Edit"}
        </button>
        <button
          type="button"
          onClick={() => {
            props.onDeleteTaskButtonClick(
              props.category,
              props.taskData.taskId
            );
          }}
          className="items-center md:w-16 w-full px-1 py-1 ml-1 mt-1 border border-gray-300 leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default Task

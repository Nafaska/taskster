import React from 'react'

const ChangeTaskStatusButton = (props) => {
  return (
    <button
      onClick={() => {
        props.onChangeTaskStatusButtonsClick(
          props.category,
          props.moveToCategory,
          props.taskId
        );
      }}
      type="button"
      className="items-center px-1 py-1 ml-1 mt-1 border border-gray-300 leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
    >
      {props.buttonName}
    </button>
  );
}

export default ChangeTaskStatusButton

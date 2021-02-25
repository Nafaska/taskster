import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Task from "./Task";
import AddNewTaskForm from "./AddNewTaskForm";
import NavigationBarByTimeMarker from "./NavigationByTimeMarker";
import Header from "./Header";


function TaskListPage() {
  const [tasksList, setTasksList] = useState([]);
  const initialState = 0;
  const noSuchCategoryState = 1;
  const categoryExistsState = 2;
  const [currentState, setCurrentState] = useState(initialState);

  const { category, timespan } = useParams();

  const processUpdateOfTaskList = (response, id) => {
    const task = tasksList.find((item) => item.taskId === id);
    const taskPosition = tasksList.indexOf(task);
    const updatedTaskList = [...tasksList];
    updatedTaskList[taskPosition] = response.data;
    setTasksList([...updatedTaskList]);
  };

  const onChangeTaskStatusButtonsClick = async (tasksCategory, status, id) => {
    try {
      const response = await axios.patch(
        `/api/v1/tasks/${tasksCategory}/${id}`,
        { status }
      );
      processUpdateOfTaskList(response, id);
    } catch (e) {
      console.error(e.response.data);
    }
  };

  const onDeleteTaskButtonClick = async (tasksCategory, id) => {
    try {
      const response = await axios.delete(
        `/api/v1/tasks/${tasksCategory}/${id}`
      );
      processUpdateOfTaskList(response, id);
    } catch (err) {
      console.error(err);
    }
  };

  const getTasksByCategory = async (tasksCategory, tasksTimespan) => {
    try {
      let response;
      if (typeof tasksTimespan === "undefined") {
        response = await axios.get(
          `/api/v1/tasks/${tasksCategory}`
        );
      } else {
        response = await axios.get(
          `/api/v1/tasks/${tasksCategory}/${tasksTimespan}`
        );
      }
      const responseArray = Object.values(response.data);
      setTasksList(responseArray);
      setCurrentState(categoryExistsState);
    } catch (err) {
      setCurrentState(noSuchCategoryState);
      console.error(err);
    }
  };

  const noTaskMessage = (
    <tr>
      <td className="px-6 py-3 text-center text-base leading-4 font-medium text-gray-600 uppercase tracking-wider">
        You do not have any tasks yet ...
      </td>
    </tr>
  );

  useEffect(() => {
    getTasksByCategory(category, timespan);
    return () => {};
  }, [category, timespan]);

  const ProcessTasksArray = (props) => {
    if (props.taskArray.length > 0) {
      let result;
      const arrayWithoutDeletedTask = props.taskArray.filter(
        (it) => it._isDeleted
      );
      if (props.taskArray.length === arrayWithoutDeletedTask.length) {
        result = noTaskMessage;
      } else {
        result = props.taskArray.map((task) => {
          let isNotDeletedTasks;
          if (task._isDeleted !== true) {
            isNotDeletedTasks = (
              <Task
                key={task.taskId}
                taskData={{ ...task }}
                onChangeTaskStatusButtonsClick={
                  props.onChangeTaskStatusButtonsClick
                }
                category={category}
                onDeleteTaskButtonClick={props.onDeleteTaskButtonClick}
              />
            );
          }
          return isNotDeletedTasks;
        });
      }
      return result;
    }
    return noTaskMessage;
  };

  return (
    <div>
      <Header />
      {currentState === noSuchCategoryState && (
        <div className="text-lg m-8 leading-tight text-gray-900">
          <b className="text-blue-700 uppercase tracking-wider">{category}</b>{" "}
          category does not exist. You can create a new one via{" "}
          <Link
            className="text-blue-700 font-bold uppercase tracking-wider"
            to="/"
          >
            Category Page.
          </Link>
        </div>
      )}
      {currentState === categoryExistsState && (
        <div className="bg-gray-500 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex px-4 pt-4 sm:pt-0 sm:px-6 lg:px-8">
            <div className="text-lg font-bold text-yellow-400 uppercase tracking-wider">
              {category}
            </div>
          </div>
          <AddNewTaskForm
            category={category}
            tasksList={tasksList}
            setTasksList={setTasksList}
            processUpdateOfTaskList={processUpdateOfTaskList}
          />
        </div>
      )}
      {currentState === categoryExistsState && (
        <div className="flex w-full flex-col">
          <NavigationBarByTimeMarker category={category} />
          <table className="w-full flex flex-col divide-y divide-gray-200 overflow-hidden border-b border-gray-200">
            <thead>
              <tr className="w-full">
                <th className="sm:px-6 px-3 w-1/2 py-3 bg-gray-200 text-left text-base leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="sm:px-6 px-3 w-1/2 py-3 bg-gray-200 text-left text-base leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th />
              </tr>
            </thead>
            <tbody className="bg-gray-100 divide-y divide-gray-200">
              <ProcessTasksArray
                taskArray={tasksList}
                onDeleteTaskButtonClick={onDeleteTaskButtonClick}
                onChangeTaskStatusButtonsClick={onChangeTaskStatusButtonsClick}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TaskListPage;

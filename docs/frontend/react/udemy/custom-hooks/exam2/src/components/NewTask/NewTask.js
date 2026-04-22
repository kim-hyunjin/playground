import { useCallback } from 'react';
import useHttp from '../../hooks/useHttp';

import Section from '../UI/Section';
import TaskForm from './TaskForm';

const NewTask = (props) => {
  const { onAddTask } = props;

  const { isLoading, error, sendRequest } = useHttp();

  const createTask = useCallback(
    (taskText, data) => {
      const generatedId = data.name; // firebase-specific => "name" contains generated id
      const createdTask = { id: generatedId, text: taskText };

      onAddTask(createdTask);
    },
    [onAddTask]
  );

  const enterTaskHandler = useCallback(
    async (taskText) => {
      sendRequest(
        {
          url: 'https://react-http-6b4a6.firebaseio.com/tasks.json',
          method: 'POST',
          body: { text: taskText },
          headers: {
            'Content-Type': 'application/json',
          },
        },
        /**
         * bind() - it prepares the function on which it's called for future execution.
         * "preconfigure" which arguments that function shuold receive.
         *  you can also define what the this keyword should refer to inside of that function.
         */
        createTask.bind(null, taskText)
      );
    },
    [sendRequest, createTask]
  );

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;

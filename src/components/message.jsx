import React from 'react';

const Message = ({ message }) => {
  const messageLines = message.split('\n').map((line, index) => (
    <p key={index} className='text-center text-lg font-normal text-gray-700 lg:text-xl dark:text-gray-400'>{line}</p>
  ));
  return <div>{messageLines}</div>;
};

export default Message;

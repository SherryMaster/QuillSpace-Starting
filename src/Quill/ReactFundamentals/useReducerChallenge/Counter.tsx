import { useReducer } from "react";

const initState = { count: 0 };

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "reset":
      return { ...state, count: 0 };
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <div>
      <h1 className="text-3xl font-bold">Count: {state.count}</h1>
      <button className="bg-green-700 p-3 m-2 rounded-md cursor-pointer hover:bg-green-900 active:bg-green-500"  onClick={() => dispatch({ type: "increment" })}>+</button>
      <button className="bg-red-700 p-3 m-2 rounded-md cursor-pointer hover:bg-red-900 active:bg-red-500" onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button className="bg-gray-700 p-3 m-2 rounded-md cursor-pointer hover:bg-gray-900 active:bg-gray-500" onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
};

export default Counter;

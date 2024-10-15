import { useRef, useState } from "react";
import axios from "axios";

function App() {
  const [state, setState] = useState(-1);
  const mailRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef<HTMLInputElement>(null);

  const getState = () => {
    if (state === -1)
      return <span className="text-orange-500">Waiting for submit</span>;
    if (state === 0) return <span className="text-blue-300">Pending</span>;
    if (state === 1) return <span className="text-red-500">Rejected</span>;
    if (state === 2) return <span className="text-green-500">Accepted</span>;
  };

  const submit = () => {
    setState(0);
    axios
      .post("https://aut-ctf.liara.run/answer", {
        key: keyRef.current?.value,
        email: mailRef.current?.value,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.correct) {
          setState(2);
        } else {
          setState(1);
        }
      })
      .catch((_err) => {
        setState(-1);
      });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold">Enter Your Answer</h1>
      <div className="flex flex-col justify-center items-center">
        <input
          type="email"
          placeholder="Email Address"
          required
          ref={mailRef}
          className="my-4 mt-5 px-5 py-2 text-2xl bg-transparent border-solid border-2 border-white rounded-xl outline-none focus:rounded-3xl transition-all"
        />
        <input
          type="text"
          placeholder="Answer ..."
          required
          ref={keyRef}
          className="px-5 py-2 text-2xl bg-transparent border-solid border-2 border-white rounded-xl outline-none focus:rounded-3xl transition-all"
        />
        <button
          onClick={submit}
          className="m-5 pt-2 pb-2 px-5 rounded-lg bg-green-500 text-2xl hover:px-7 transition-all"
        >
          Submit
        </button>
      </div>

      <p>Result: {getState()}</p>
    </div>
  );
}

export default App;

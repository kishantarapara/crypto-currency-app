import "./App.css";

import { message } from "antd";
import "antd/dist/antd.css";

import AppRouter from "./router/AppRouter";

function App() {
  message.config({
    maxCount: 1,
    duration: 1,
  });
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;

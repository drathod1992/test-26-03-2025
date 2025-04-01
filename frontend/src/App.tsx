import "./App.css";
import PostList from "./components/PostList";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PostList />
      </Provider>
    </div>
  );
}

export default App;

import "./App.css";
import { Provider } from "react-redux";
import store from "./store/store";
import PostList from "./components/postList/PostList";

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

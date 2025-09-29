import "./index.css";
import GeneralNews from "./pages/GeneralNews";
import RSSFeeds from "./pages/RSSFeeds";

function App() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={"App"}>
      <h1 onClick={refreshPage}>Lazy&thinsp;News&nbsp;App</h1>
      <div>
        <button type="button">Click for More News</button>
        <button type="button">Click for More RSS Feed News</button>
      </div>
      <GeneralNews />
      <RSSFeeds />
    </div>
  );
}

export default App;

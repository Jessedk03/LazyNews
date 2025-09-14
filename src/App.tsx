import React, { useEffect, useState } from "react";
import "./index.css";
import { Article } from "./http/ArticleType";

function App() {
  const refreshPage = () => {
    window.location.reload();
  };
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://192.168.200.225:8080/api/index", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={"App"}>
      <h1 onClick={refreshPage}>Lazy&thinsp;News&nbsp;App</h1>
      <div className="content">
        {articles.length > 0 ? (
          articles.map((a, i) => (
            <div className={"content-item"}>
              <div className={"content-title"} key={i}>
                {a.title}
              </div>
              <div className={"content-description"}>
                {a.description}&nbsp;
                <a href={`/article/${a.id}`} className={"read-more"}>
                  [&thinsp;&gt;&thinsp;]
                </a>
              </div>
              <div className={"content-source"}>
                <b>Source:&nbsp;</b>{" "}
                <a href={a.source.url} target={"_blank"}>
                  {a.source.url}
                </a>
                &nbsp;
                <b>Name:&nbsp;</b>
                {a.source.name}
              </div>
              <div className={"content-source"}>
                <a href={a.url} target={"_blank"}>
                  Read original article
                </a>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default App;

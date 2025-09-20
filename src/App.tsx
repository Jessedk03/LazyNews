import React, { useEffect, useState } from "react";
import "./index.css";
import { Article } from "./http/ArticleType";
import useMobileView from "./hooks/useMobileView";

function App() {
  const isMobile = useMobileView();

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
              <div
                className={isMobile ? "content-title-mobile" : "content-title"}
                key={i}
              >
                {a.title}
              </div>
              <div
                className={
                  isMobile
                    ? "content-description-mobile"
                    : "content-description"
                }
              >
                {a.description}&nbsp;
                <a href={`/article/${a.id}`} className={"read-more"}>
                  [&thinsp;&gt;&thinsp;]
                </a>
              </div>
              <div
                className={
                  isMobile ? "content-source-mobile" : "content-source"
                }
              >
                <b>Source:&nbsp;</b>{" "}
                <a
                  href={a.source.url}
                  target={"_blank"}
                  rel="noreferrer noopener"
                >
                  {a.source.url}
                </a>
                &nbsp;
                <b>Name:&nbsp;</b>
                {a.source.name}
              </div>
              <div
                className={
                  isMobile ? "content-source-mobile" : "content-source"
                }
              >
                <a href={a.url} target={"_blank"} rel="noreferrer noopener">
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

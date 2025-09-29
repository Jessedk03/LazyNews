import { useState } from "react";
import { getArticles } from "../http/getArticles";
import { Article } from "../http/ArticleType";

function GeneralNews() {
  const [articles, setArticles] = useState<Article[]>([]);

  getArticles().then((data: any) => {
    if (data) {
      setArticles(data);
    }
  });

  return (
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
              <a href={a.source.url} target={"_blank"} rel="noreferrer">
                {a.source.url}
              </a>
              &nbsp;
              <b>Name:&nbsp;</b>
              {a.source.name}
            </div>
            <div className={"content-source"}>
              <a href={a.url} target={"_blank"} rel="noreferrer">
                Read original article
              </a>
            </div>
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default GeneralNews;

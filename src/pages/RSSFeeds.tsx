import { useState } from "react";
import { getRssArticles } from "../http/getRssArticles";
import { RssArticle } from "../http/RssArticleType";

function RSSFeeds() {
  const [rssArticles] = useState<RssArticle[]>([]);

  getRssArticles().then((items: any[]) => {
    console.log(items);
    // if (items) {
    //   const articles = items.map((item: any) => ({
    //     title: item.title,
    //     description: item.description,
    //     content: item["content:encoded"] || item.description || "",
    //     url: item.link,
    //     image_url: item.enclosure?.["@_url"] || "",
    //     author: item.author || item["dc:creator"] || "",
    //     creator: item["dc:creator"] || item.author || "",
    //     category: Array.isArray(item.category)
    //       ? item.category
    //       : [item.category].filter(Boolean),
    //   }));
    //   setRssArticles(articles);
    // }
  });

  return (
    <div>
      <h2>RSS Feeds</h2>
      {rssArticles.length > 0 ? (
        <ul>
          {rssArticles.map((article) => (
            <li key={article.url}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url}>Read more</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}

export default RSSFeeds;

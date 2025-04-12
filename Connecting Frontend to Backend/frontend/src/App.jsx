import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="main">
        <h1>Jokes</h1>
        <p>JOKES : {jokes.length}</p>
        {jokes.map((joke) => {
          return (
            <div className="jokes" key={joke.id}>
              <h2>Title : {joke.title}</h2>
              <p>Content : {joke.content}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;

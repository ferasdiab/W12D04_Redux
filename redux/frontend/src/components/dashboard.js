import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setArticle,
  createArticle,
  deleteArticle,
  updateArticle,
} from "../reducer/article/index";
import jwt from "jsonwebtoken";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const state = useSelector((state) => {
    return {
      article: state.article.article,
      token: state.token.token,
    };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("http://localhost:5000/articles").then((result) => {
      dispatch(setArticle(result.data));
    });
    const user = jwt.decode(state.token);
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  const addOne = () => {
    console.log({ title, description, userId });
    axios
      .post("http://localhost:5000/articles", {
        title,
        description,
        author: userId,
      })
      .then((result) => {
        dispatch(createArticle(result.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const allArticle = state.article.map((element, index) => {
    return (
      <div className="allArticlesCH">
        <div className="articlesTitle">
          <h2>{element.title}</h2>
          <p>{element.description}</p>
          <button>more info</button>
          {userId == element.author ? (
            <button
              onClick={() => {
                axios
                  .delete(`http://localhost:5000/articles/${element._id}`)
                  .then((result) => {
                    // dispatch(deleteArticle(element))
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              delete
            </button>
            // hi
          ) : (
            ""
          )}

          {userId == element.author ? (
            <div>
             
              
              <input
                placeholder="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              /><br/>
              <button onClick = {()=>{
                axios.put(`http://localhost:5000/articles/${element._id}`,{title})
                .then(result=>{
                  dispatch(updateArticle(result.data));
                })

              }
                
              }>update</button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="Dashboard">
      <p>Dashboard</p>
      <div className="allArticlesP">{allArticle}</div>
      <input
        placeholder="title here "
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <textarea
        placeholder="description"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      ></textarea>
      <button onClick={addOne}>add new article</button>
      
    </div>
  );
}

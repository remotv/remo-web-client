import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Requests:
 * @param {string} url the URL we are making a request to
 * @param {string} type POST, GET, PUT, DELETE, etc...
 * @param {object} payload the object sent to the server for this request
 * @param {function()} handleResult callback function handled by parent component
 *        @returns {responseObject} returns response object from the server
 *
 * @example
 * <Requests url="remo.tv/api/request"
 *           type="post"
 *           payload={ key: "item" }
 *           handleResult={ result => this.handleResult( result )}
 *           />
 */

const Requests = ({ url, type, payload, handleResult }) => {
  const [retry, setRetry] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    handleReq();
  });

  const handleReq = () => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!type || type === "post") handlePost();
    return null;
  };

  const handleTimeout = () => {
    handleResult({ error: "error, unable to complete request, retrying." });
    if (retry < 3) {
      setTimeout(() => {
        handlePost();
      }, 600); //retry
      setRetry(retry + 1);
    } else {
      handleResult({
        error: "unable to contact server, please try again later.",
      });
    }
  };

  const handlePost = () => {
    if (!token) handleResult({ error: "authentication error." });
    console.log("Posting to URL: ", url);
    console.log(token, payload);
    axios
      .post(
        url,

        payload,

        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("REQUEST RESULT: ", res.data);
        handleResult(res.data);
      })
      .catch((err) => {
        console.log("API Request Error: ", err);
        // handleTimeout();
      });
    return null;
  };

  return <React.Fragment />;
};

export default Requests;

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

const Requests = ({
  url,
  type,
  payload,
  handleResult,
  pending,
  handlePending,
}) => {
  // const [retry, setRetry] = useState(0);
  const [token] = useState(() => {
    return localStorage.getItem("token");
  });

  useEffect(() => {
    if (!pending) {
      console.log(handlePending);
      handlePending(true);
      handleReq();
    }
  });

  const handleReq = () => {
    if (!type || type === "post") handlePost();
    return null;
  };

  // const handleTimeout = () => {
  //   handleResult({ error: "error, unable to complete request, retrying." });
  //   if (retry < 3) {
  //     setTimeout(() => {
  //       handlePost();
  //     }, 600); //retry
  //     setRetry(retry + 1);
  //   } else {
  //     handleResult({
  //       error: "unable to contact server, please try again later.",
  //     });
  //   }
  // };

  const handlePost = () => {
    if (!token) return handleResult({ error: "authentication error." });
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
        const error = err.response.data.error;
        console.log("API Request Error: ", error);
        handleResult({ error: error });
        // handleTimeout();
      });
    return null;
  };

  return <React.Fragment />;
};

export default Requests;

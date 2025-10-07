import { useState, useEffect, useCallback } from "react";

export default function App() {
  const baseUrl = "http://localhost:3333/products";
  const searchUrl = "http://localhost:3333/products?search=";
  const [searchedWord, setSearchedWord] = useState("");
  const [products, setProducts] = useState([]);
  const [allproducts, setAllProducts] = useState([]);
  const [message, setMessage] = useState("");

  function debounce(callback, delay) {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(value);
      }, delay);
    };
  }

  function fetchUrl(url) {
    fetch(url)
      .then((res) => res.json())
      .then((response) => setProducts(response))
      .catch((err) => console.error(err));
  }
  function fetchUrlAll(url) {
    fetch(url)
      .then((res) => res.json())
      .then((response) => setAllProducts(response))
      .catch((err) => console.error(err));
  }

  const onChange = (e) => {
    setSearchedWord(e.target.value);
  };

  useEffect(() => {
    fetchUrlAll(baseUrl);
  }, []);

  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchUrl(`${searchUrl}${query}`);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchedWord.trim().length > 0) {
      debouncedFetch(searchedWord);
    }
  }, [searchedWord, debouncedFetch]);

  useEffect(() => {
    if (searchedWord.length > 0) {
      if (products.length === 0) {
        setMessage("Nessuna corrispondenza trovata");
      } else {
        setMessage(null);
      }
    }
  }, [products, searchedWord]);

  return (
    <>
      <div className="container">
        <h1 className="text-center my-3">Lista dei prodotti</h1>
        <div className="d-center">
          <div className="d-center my-3">
            <h2 className="text-center my-3">{message}</h2>
            <input
              type="text"
              value={searchedWord}
              onChange={onChange}
              placeholder="Cerca prodotto..."
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-8 d-center">
            {searchedWord.length ? (
              <ul className="row d-center">
                {products.map((p) =>
                  p.name.toLowerCase().includes(searchedWord.toLowerCase()) ? (
                    <li key={p.id}>{p.name}</li>
                  ) : null
                )}
              </ul>
            ) : (
              <ul>
                {allproducts.map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

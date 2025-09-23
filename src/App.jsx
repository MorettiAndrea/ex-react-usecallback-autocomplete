import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function App() {
  const baseUrl = "http://localhost:3333/products?search=";
  const [searchedWord, setSearchedWord] = useState("");
  const [products, setProducts] = useState([]);

  function fetchUrl(url) {
    fetch(url)
      .then((res) => res.json())
      .then((response) => setProducts(response))
      .catch((err) => console.error(err));
  }

  const onChange = (e) => {
    setSearchedWord(e.target.value);
  };

  useEffect(() => {
    if (searchedWord.length) {
      fetchUrl(`${baseUrl}${searchedWord}`);
    }
  }, [searchedWord]);

  return (
    <>
      <input
        type="text"
        value={searchedWord}
        onChange={onChange}
        placeholder="Cerca prodotto..."
        required
      />
      {searchedWord.length ? (
        <ul>
          {products.map((p, index) =>
            p.name.toLowerCase().includes(searchedWord.toLowerCase()) ? (
              <li key={index}>{p.name}</li>
            ) : null
          )}
        </ul>
      ) : (
        <h1 className="text-center">Nessun elemento selezionato</h1>
      )}
    </>
  );
}

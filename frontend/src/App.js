import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/items/")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div>
      <h1>Items from FastAPI</h1>
      <ul>
        {items.map(item => <li key={item.item_id}>{item.name}</li>)}
      </ul>
    </div>
  );
}

export default App;


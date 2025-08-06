import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'

const RelatedProducts = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_PORT}/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {products.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts

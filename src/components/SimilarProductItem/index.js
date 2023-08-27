// Write your code here
import './index.css'

const EachSimilarItem = props => {
  const {eachItem} = props
  const {imageUrl, title, brand, price, rating} = eachItem

  return (
    <div className="similar-products-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="each-product-heading">{title}</p>
      <p className="each-product-brand">by {brand}</p>
      <div className="each-product-price-rating-container">
        <p className="each-product-price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </div>
  )
}

const SimilarProductItem = props => {
  const {similarProducts} = props

  return (
    <>
      <h1 className="similar-products-heading">Similar Products</h1>
      <div className="similar-products-bg-container">
        {similarProducts.map(eachItem => (
          <EachSimilarItem eachItem={eachItem} key={eachItem.id} />
        ))}
      </div>
    </>
  )
}

export default SimilarProductItem

// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    productItem: {},
    noOfItems: 1,
    similarProducts: [],
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(productDetailsApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,

        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const similarProductsItems = data.similar_products.map(eachItem => ({
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,

        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        productItem: updatedData,
        similarProducts: similarProductsItems,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getLoader = () => (
    <div data-testid="loader" className="loader-el">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getFailure = () => (
    <>
      <div className="failure-bg-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-product-text">Product Not Found</h1>
        <button
          type="button"
          className="failure-button"
          onClick={this.continueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  decreaseCount = () => {
    const {noOfItems} = this.state
    if (noOfItems > 1) {
      this.setState(prevState => ({noOfItems: prevState.noOfItems - 1}))
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({noOfItems: prevState.noOfItems + 1}))
  }

  getSuccessView = () => {
    const {productItem, noOfItems, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItem
    return (
      <>
        <div className="product-item-details-bg-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="details-container">
            <h1 className="product-item-heading">{title}</h1>
            <p className="product-item-price">Rs {price}/-</p>
            <div className="ratings-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p className="reviews-text">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability-text">Available: {availability}</p>
            <p className="brand-text">Available: {brand}</p>
            <hr className="line" />
            <div className="count-container">
              <button
                type="button"
                className="count-button"
                data-testid="minus"
                onClick={this.decreaseCount}
              >
                <BsDashSquare />
              </button>
              <p className="no-of-items-text">{noOfItems}</p>
              <button
                type="button"
                className="count-button"
                data-testid="plus"
                onClick={this.increaseCount}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart">
              Add To Cart
            </button>
          </div>
        </div>
        <SimilarProductItem similarProducts={similarProducts} />
      </>
    )
  }

  switchingViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.getLoader()
      case apiStatusConstants.failure:
        return this.getFailure()
      case apiStatusConstants.success:
        return this.getSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.switchingViews()}
      </>
    )
  }
}

export default ProductItemDetails

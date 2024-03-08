// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstans = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    simialrProductData: [],
    apiStatus: apiStatusConstans.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    price: data.price,
    id: data.id,
    totalReviews: data.total_reviews,
    rating: data.rating,
    imageUrl: data.image_url,
    title: data.title,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstans.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const newData = this.getFormattedData(data)
      const updateSimilarProductsData = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productData: newData,
        simialrProductData: updateSimilarProductsData,
        apiStatus: apiStatusConstans.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstans.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onDecrese = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(each => ({
        quantity: each.quantity - 1,
      }))
    }
  }

  onIncrease = () => {
    const {quantity} = this.state
    this.setState(each => ({
      quantity: each.quantity + 1,
    }))
  }

  renderProductDeatailsView = () => {
    const {productData, quantity, simialrProductData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div>
        <img src={imageUrl} alt="product" />
        <div>
          <h1>{title}</h1>
          <p>Rs {price}</p>
          <div>
            <p>{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
            <p>{totalReviews} Reviews</p>
          </div>
          <p>{description}</p>
          <div>
            <p>Available</p>
            <p>{availability}</p>
            <div>
              <p>Brand</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div>
              <button
                type="button"
                onClick={this.onDecrese}
                data-testid="minus"
              >
                <BsDashSquare className="button" />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                onClick={this.onIncrease}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
          <h1>Similar Products</h1>
          <ul>
            {simialrProductData.map(each => (
              <SimilarProductItem productDetails={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstans.success:
        return this.renderProductDeatailsView()
      case apiStatusConstans.failure:
        return this.renderFailureView()
      case apiStatusConstans.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails

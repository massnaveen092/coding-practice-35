// Write your code here

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, brand, price, rating} = productDetails

  return (
    <li>
      <img src={imageUrl} alt={title} />
      <p>{title}</p>
      <p>by {brand}</p>
      <div>
        <p>Rs {price}</p>
        <p>{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
      </div>
    </li>
  )
}

export default SimilarProductItem

console.log("hi")

//************************* Global Variables *************************
const restaurantsUrl = "http://localhost:3000/api/v1/restaurants";
const usersUrl = "http://localhost:3000/api/v1/users";
const commentsUrl = "http://localhost:3000/api/v1/comments";
let allRestaurantsArray = [];
//********************** End of Global Variables *********************


//******************* Listen for DOMContentLoaded ********************
document.addEventListener('DOMContentLoaded', function() {

  const restaurantsContainer = document.querySelector('#restaurant-container')
  const allRestaurantsContainer = document.querySelector('#all-restaurants-container')
  const formContainer = document.querySelector('#form-container')


//*********************** Delegate Events for: ***********************
  allRestaurantsContainer.addEventListener('click', function(event) {
    let id;
    let increasedLikes;
//********************* Add Likes to Restaurant **********************
    if (event.target.id === "likes-btn") {
      id = parseInt(event.target.dataset.id);
      let currentLikes = parseInt(event.target.innerText.split(' ').slice(-1)[0])
      increasedLikes = ++currentLikes
      event.target.innerText = `Likes: ${increasedLikes}`

      allRestaurantsArray.forEach(function(restaurant) {
        if (restaurant.id === id) {
          restaurant.likes = increasedLikes;
        }
      })

      fetch(`${restaurantsUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: increasedLikes
        })
      })
//******************* End of Add Likes to Restaurant *****************

    } else if (event.target.id === "edit-btn") {
      id = parseInt(event.target.dataset.id);
      console.log(id)
    }

  })
//********************* End of Event Delegation **********************


//***************************** Fetches ******************************
  fetch(restaurantsUrl)
    .then(res => res.json())
    .then(allRestaurants => {
      allRestaurantsArray = allRestaurants;
      renderAllRestaurants(allRestaurantsArray);
    });
//************************* End of Fetches ***************************


//**************************** Functions *****************************
  function renderAllRestaurants(restaurantArray) {
    restaurantArray.forEach(function(singleRestaurant) {
      renderSingleRestaurant(singleRestaurant);
    })
  }

  function renderSingleRestaurant(singleRestaurant) {
    restaurantsContainer.innerHTML += `
      <h2>${singleRestaurant.name}</h2>
      <p>Photo - ${singleRestaurant.photo}</p>
      <p>Food type: ${singleRestaurant.food_type}</p>
      <p>Location: ${singleRestaurant.location}</p>
      <button id="likes-btn" data-id=${singleRestaurant.id}>Likes: ${singleRestaurant.likes}</button><button id="edit-btn" data-id=${singleRestaurant.id}>Edit</button>
      `
  }

  function renderUpdateForm() {
    return `
    <form data-id=${this.id}>
      <label>Title</label>
      <p>
        <input type="text" value="${this.title}" />
      </p>
      <label>Content</label>
      <p>
        <textarea>${this.content}</textarea>
      </p>
      <button type='submit'>Save Note</button>
    </form>
  `;
  }
//************************* End of Functions *************************

})
//**************** End of Listen for DOMContentLoaded ****************

console.log("hi")

//************************* Global Variables *************************
const restaurantsUrl = "http://localhost:3000/api/v1/restaurants";
const usersUrl = "http://localhost:3000/api/v1/users";
const commentsUrl = "http://localhost:3000/api/v1/comments";
let allRestaurantsArray = [];
let allUsersArray = [];
let addedUserId;
let commentsContainer;
let formContainer;
//********************** End of Global Variables *********************


//******************* Listen for DOMContentLoaded ********************>>>>>
document.addEventListener('DOMContentLoaded', function() {


//******** Variables Local to DOMContentLoaded Event Listener ********
  const restaurantsContainer = document.querySelector('#restaurant-container')
  const allRestaurantsContainer = document.querySelector('#all-restaurants-container')
  const addUserForm = document.querySelector('#add-user');
  const userChoiceButtons = document.querySelector('#welcome')
  const addRestaurantFormContainer = document.querySelector('#add-restaurant-form')
  const selectUserForm = document.querySelector('#users-container')
  const headingDiv = document.querySelector('#heading')
  const commentsContainers = document.querySelectorAll('#comments-container')
  const restaurantsSearchContainer = document.querySelector('#search-restaurant-container')
  const userButtons = document.getElementsByClassName('user-btns')
//***** End of Variables Local to DOMContentLoaded Event Listener ****


//********************** Choose New/Return User **********************
  userChoiceButtons.addEventListener('click', function(event) {
    if (event.target.id === 'new-user-btn') {
      showAddUserForm()
    } else if (event.target.id === 'ret-user-btn') {
      showSelectUserForm()
      renderAllUsersToSelectForm(allUsersArray)
    }
  })
//******************* End of Choose New/Return User ******************


//************************* Add a New User ****************************
  addUserForm.innerHTML = `
    <form id="new-user-form">
      <h3>---User Form---</h3>
      <label>User Name:</label>
      <p>
        <input id="user-name" type="text" placeholder="enter name..." />
      </p>
      <label>Location:</label>
      <p>
        <input id="user-location" type="text" placeholder="enter location..." />
      </p>
      <label>Favorite Food:</label>
      <p>
        <input id="user-fav-food" type="text" placeholder="enter favorite food..." />
      </p>
      <button type='submit' value='submit'>Submit</button>
    </form>
    `
  addUserForm.addEventListener('submit', function(event) {
    event.preventDefault()
    let userName = event.target.querySelector('#user-name').value
    let userLocation = event.target.querySelector('#user-location').value
    let userFavFood = event.target.querySelector('#user-fav-food').value
    document.querySelector('#new-user-form').reset()

    fetch(usersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: userName,
        location: userLocation,
        fav_food: userFavFood
      })
    })
      .then(res => res.json())
      .then(addedUser => {
        addedUserId = addedUser.id
      })

      hideWelcomePage()
      hideAddUserForm()
      revealHeading()
      renderNewRestaurantForm()
      revealRestaurants()

  })
//*********************** End of Add a New User **********************


//*************************** Get All Users **************************
  fetch(usersUrl)
  .then(res => res.json())
  .then(allUsers => {
    allUsersArray = allUsers
  })
//*********************** End of Get All Users ***********************


//********************* Select from Existing User ********************
  selectUserForm.innerHTML = `
    <form id="select-ret-user">
      <select id="userSelection">
      </select>
      <button type="submit" value="submit">Select User</button>
    </form>
    <p>Choose your profile.</p>
    `
  selectUserForm.addEventListener('submit', function(event) {
    event.preventDefault()
    addedUserId = parseInt(document.getElementById('userSelection').value)
    hideWelcomePage()
    hideSelectUserForm()
    revealHeading()
    renderNewRestaurantForm()
    revealRestaurants()
  })
//****************** End of Select from Existing User ****************


//*********************** Get All Restaurants ************************
  fetch(restaurantsUrl)
  .then(res => res.json())
  .then(allRestaurants => {
    allRestaurantsArray = allRestaurants;
    renderAllRestaurants(allRestaurants);
  });
//******************* End of Get All Restaurants**********************


//*************************** Add Restaurant *************************
  addRestaurantFormContainer.addEventListener('submit', function(event) {
    event.preventDefault()
    let newRestaurantName = event.target.querySelector('#new-name').value
    let newRestaurantPhoto = event.target.querySelector('#new-photo').value
    let newRestaurantFoodType = event.target.querySelector('#new-food_type').value
    let newRestaurantLocation = event.target.querySelector('#new-location').value
    document.querySelector('#new-restaurant-form').reset()

    fetch(restaurantsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: newRestaurantName,
        location: newRestaurantLocation,
        food_type: newRestaurantFoodType,
        likes: 0,
        photo: newRestaurantPhoto,
        user_id: addedUserId
      })
    })
      .then(res => res.json())
      .then(addedRestaurant => {
        renderSingleRestaurant(addedRestaurant)
      })

  })
//************************ End of Add Restaurant *********************


//************************* Search Restaurants ***********************
  restaurantsSearchContainer.addEventListener('input', function(event) {
    console.log(event.target.value)
  })

//********************** End of Search Restaurants *******************


//****************** Delegate Events for Restaurants *****************
  allRestaurantsContainer.addEventListener('click', function(event) {
    let likesId;
    let increasedLikes;
    let updateId;
//********************* Add Likes to Restaurant **********************
    if (event.target.id === "likes-btn") {
      likesId = parseInt(event.target.dataset.id);
      let currentLikes = parseInt(event.target.innerText.split(' ').slice(-1)[0])
      increasedLikes = ++currentLikes
      event.target.innerText = `Likes: ${increasedLikes}`

      allRestaurantsArray.forEach(function(restaurant) {
        if (restaurant.id === likesId) {
          restaurant.likes = increasedLikes;
        }
      })

      fetch(`${restaurantsUrl}/${likesId}`, {
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


//************************** Edit Restaurant *************************
    } else if (event.target.id === "edit-btn") {
      updateId = parseInt(event.target.dataset.id);
      let restaurantToUpdate = allRestaurantsArray.find(function(restaurant) {
        return restaurant.id === updateId;
      })

      formContainer = event.target.parentElement.querySelector('#form-container')
      renderUpdateRestaurant(restaurantToUpdate)

      formContainer.addEventListener('submit', function(event) {
        event.preventDefault();
        let updatedName = event.target.querySelector('#name').value
        let updatedFoodType = event.target.querySelector('#food_type').value
        let updatedLocation = event.target.querySelector('#location').value

        event.target.parentElement.parentElement.querySelector('#page-name').innerText = updatedName
        event.target.parentElement.parentElement.querySelector('#page-food-type').innerText = `Food type: ${updatedFoodType}`
        event.target.parentElement.parentElement.querySelector('#page-location').innerText = `Location: ${updatedLocation}`

        formContainer.innerHTML = ""

        allRestaurantsArray.forEach(function(restaurant) {
          if (restaurant.id === updateId) {
            restaurant.name = updatedName;
            restaurant.food_type = updatedFoodType;
            restaurant.location = updatedLocation;
          }
        })

        fetch(`${restaurantsUrl}/${updateId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: updatedName,
            food_type: updatedFoodType,
            location: updatedLocation
          })
        })

      })
//*********************** End of Edit Restaurant *********************


//********************* Add Comment to Restaurant ********************
    } else if (event.target.id === "add-comment-btn") {
      event.preventDefault()
      let newComment = event.target.parentElement.querySelector('#comment-content').value
      let commentRestaurantId = parseInt(event.target.parentElement.dataset.id)

      let currentCommentContainer = event.target.parentElement.parentElement.parentElement.querySelector(`#comments-container-${commentRestaurantId}`)

      event.target.parentElement.reset()

      fetch(commentsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          content: newComment,
          likes: 0,
          dislikes: 0,
          restaurant_id: commentRestaurantId,
          user_id: addedUserId
        })
      })
        .then(res => res.json())
        .then(returnedComment => {
          currentCommentContainer.innerHTML += `
            <li>${returnedComment.content}</li>
            <button data-id=${returnedComment.id} id="comment-like-btn">Likes: 0</button><button data-id=${returnedComment.id} id="comment-dislike-btn">Dislikes: 0</button>
            `
        })

        //
//****************** End of Add Comment to Restaurant ****************


//************************ Add Like to Comment ***********************
    } else if (event.target.id === "comment-like-btn") {

      let currentCommentLikes = parseInt(event.target.innerText.split(' ')[1])
      let increasedCommentLikes = currentCommentLikes + 1
      let commentLikesId = parseInt(event.target.dataset.id)

      let commentLikesRestaurantId = parseInt(event.target.parentElement.parentElement.parentElement.dataset.id)

      event.target.innerText = `Likes: ${increasedCommentLikes}`

      allRestaurantsArray.forEach(function(restaurant) {
        if (restaurant.id === commentLikesRestaurantId) {
          restaurant.comments.forEach(function(comment) {
            if (comment.id === commentLikesId) {
              comment.likes = increasedCommentLikes
            }
          })
        }
      })

      fetch(`${commentsUrl}/${commentLikesId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: increasedCommentLikes
        })
      })
//********************* End of Add Like to Comment *******************


//*********************** Add Disike to Comment **********************
    } else if (event.target.id === "comment-dislike-btn") {
      let currentCommentDislikes = parseInt(event.target.innerText.split(' ')[1])
      let increasedCommentDislikes = currentCommentDislikes + 1
      let commentDislikesId = parseInt(event.target.dataset.id)

      let commentDislikesRestaurantId = parseInt(event.target.parentElement.parentElement.parentElement.dataset.id)

      event.target.innerText = `Likes: ${increasedCommentDislikes}`

      allRestaurantsArray.forEach(function(restaurant) {
        if (restaurant.id === commentDislikesRestaurantId) {
          restaurant.comments.forEach(function(comment) {
            if (comment.id === commentDislikesId) {
              comment.likes = increasedCommentDislikes
            }
          })
        }
      })

      fetch(`${commentsUrl}/${commentDislikesId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          dislikes: increasedCommentDislikes
        })
      })
    }
//******************** End of Add Disike to Comment ******************


  })
//************* End of Event Delegation for Restaurants **************


//**************************** Functions *****************************
  function renderAllUsersToSelectForm(userArray) {
    allUsersArray.forEach(function(user) {
      renderSingleUsertoSelectForm(user)
    })
  }

  function renderSingleUsertoSelectForm(user) {
    let userDropdown = document.querySelector('#userSelection')
    userDropdown.innerHTML += `
      <option value=${user.id}>${user.name}</option>
      `
  }

  function revealHeading() {
    headingDiv.style.display = 'initial'
  }

  function hideWelcomePage() {
    userChoiceButtons.style.display = 'none'
  }

  function revealRestaurants() {
    restaurantsContainer.style.display = 'initial'
  }

  function hideAddUserForm() {
    addUserForm.style.display = 'none'
  }

  function showAddUserForm() {
    addUserForm.style.display = 'initial'
  }

  function showSelectUserForm() {
    selectUserForm.style.display = 'initial'
  }

  function hideSelectUserForm() {
    selectUserForm.style.display = 'none'
  }

  function renderAllRestaurants(restaurantArray) {
    restaurantArray.forEach(function(singleRestaurant) {
      renderSingleRestaurant(singleRestaurant);
    })
  }

  function renderSingleRestaurant(singleRestaurant) {
    restaurantsContainer.innerHTML += `
      <div data-id=${singleRestaurant.id} class="restaurant-entry">
        <h2 id="page-name">${singleRestaurant.name}</h2>
        <img id="page-photo" src=${singleRestaurant.photo}>
        <p id="page-food-type">Food type: ${singleRestaurant.food_type}</p>
        <p id="page-location">Location: ${singleRestaurant.location}</p>
        <button id="likes-btn" data-id=${singleRestaurant.id}>Likes: ${singleRestaurant.likes}</button><button id="edit-btn" data-id=${singleRestaurant.id}>Edit</button>
        <div data-id=${singleRestaurant.id} id="form-container">
        </div>
        <div data-id=${singleRestaurant.id} id="add-comment-container">
          <form id="single-comment-form" data-id=${singleRestaurant.id}>
          <label>Let us know your thoughts...</label>
          <p>
            <input id="comment-content" type="textarea" placeholder="comment here..." />
          </p>
          <button id="add-comment-btn" type="submit">Add Comment</button>
        </div>
        <div>Comments:
          <ul id="comments-container-${singleRestaurant.id}">
          </ul>
        </div>
      </div>
      `

    commentsContainer = document.querySelector(`#comments-container-${singleRestaurant.id}`)

    singleRestaurant.comments.forEach(function(comment) {
      commentsContainer.innerHTML += `
        <li>${comment.content}</li>
        <button data-id=${comment.id} id="comment-like-btn">Likes: ${comment.likes}</button><button data-id=${comment.id} id="comment-dislike-btn">Dislikes: ${comment.dislikes}</button>
        `
    })

  }

  function renderUpdateRestaurant(restaurantToUpdate) {
    formContainer.innerHTML = `
    <form data-id=${restaurantToUpdate.id}>
      <h3>---Update Food Stop---</h3>
      <label>Food Stop Name:</label>
      <p>
        <input id="name" type="text" value="${restaurantToUpdate.name}" />
      </p>
      <label>Food Stop Type:</label>
      <p>
        <input id="food_type" type="text" value="${restaurantToUpdate.food_type}" />
      </p>
      <label>Food Stop Location:</label>
      <p>
        <input id="location" type="text" value="${restaurantToUpdate.location}" />
      </p>
      <button type='submit'>Save Food Stop</button>
    </form>
    `
  }

  function renderNewRestaurantForm() {
    addRestaurantFormContainer.innerHTML = `
    <form id="new-restaurant-form">
      <h3>---Add Food Stop---</h3>
      <label>Food Stop Name:</label>
      <p>
        <input id="new-name" type="text" placeholder="Restaurant name..." />
      </p>
      <label>Food Stop Photo:</label>
      <p>
        <input id="new-photo" type="text" placeholder="enter url..." />
      </p>
      <label>Food Stop Type:</label>
      <p>
        <input id="new-food_type" type="text" placeholder="Type of food served..." />
      </p>
      <label>Food Stop Location:</label>
      <p>
        <input id="new-location" type="text" placeholder="Location last seen..." />
      </p>
      <button type='submit'>Save Food Stop</button>
    </form>
    `
  }
//************************* End of Functions *************************


})
//**************** End of Listen for DOMContentLoaded ****************<<<<<

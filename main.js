

$(document).ready(() => {
  //============= Loading Screen
  $(".loadingScreen").fadeOut(700, () => {
    $("body").css("overflow", "auto");
  });

  const sideBar = $(".sideBar");
  const innerBar = $(".innerBar");
  const innerBarWidth = innerBar.innerWidth();
  sideBar.css("left", -innerBarWidth);
  const navLinks = $(".navLinks li");
  const dataContainer = $("#mealsData");
  const searchContainer = $("#searchBox");
  const contactContainer = $("#contact");

  //============= Side Bar
  const openSideBar = () => {
    sideBar.animate({ left: 0 }, 500);
    $(".openCloseBtn i").attr("class", "fa-solid fa-xmark fa-2x");

    navLinks.each((i, link) => {
      $(link).delay(100 * i).animate({ top: 0 }, 500);
    });
  };

  const closeSideBar = () => {
    sideBar.animate({ left: -innerBarWidth }, 500);
    $(".openCloseBtn i").attr("class", "fa-solid fa-bars fa-2x");
    navLinks.animate({ top: "300px" }, 500);
  };

  $(".openCloseBtn").on("click", () => {
    sideBar.css("left") === "0px" ? closeSideBar() : openSideBar();
  });

  //=========== Getting Data From API
  let meals = [];

  const getMeals = async () => {
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=`
    );
    const apiResponse = await mealAPI.json();
    meals = apiResponse.meals;
    displayMeals();
  };

  getMeals();

  const displayMeals = () => {
    let mealsData = "";
    meals.forEach((meal) => {
      const { strMealThumb: imgSrc, strMeal: mealName, idMeal: mealId } = meal;
      mealsData += `
        <div class="col-md-3">
          <div class="item">
            <img src="${imgSrc}" loading="lazy" class="w-100" alt="${mealName}">
            <div class="layerMeal"><h2  data-id="${mealId}">${mealName}</h2></div>
          </div>
        </div>`;
    });
    dataContainer.html(mealsData);

    $(".item").on("click", function () {
      const mealId = $(this).find("h2").attr("data-id");
      getMealById(mealId);
    });
  };

  const displayInstructions = (meal) => {
    $("#mealsData").html("");
    let ingredients = "";
    for (let i = 0; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
      }
    }

    let tags = "";
    if (meal.strTags) {
      meal.strTags.split(",").forEach((tag) => {
        tags += `<li class="alert alert-danger m-2 p-1">${tag}</li>`;
      });
    }

    const mealInfo = `
      <div class="col-md-4 text-white">
        <img src="${meal.strMealThumb}" class="rounded-2 w-100 mb-3" alt="" />
        <h2>${meal.strMeal}</h2>
      </div>
      <div class="col-lg-8 text-white">
        <h2 class="fw-bold">Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bold">Area: </span>${meal.strArea}</h3>
        <h3><span class="fw-bold">Category: </span>${meal.strCategory}</h3>
        <h3><span class="fw-bold">Ingredients:</span></h3>
        <ul class="list-unstyled d-flex flex-wrap g-3">${ingredients}</ul>
        <h3><span class="fw-bold">Tags:</span></h3>
        <ul class="list-unstyled d-flex flex-wrap g-3">${tags}</ul>
        <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
        <a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
      </div>`;

    dataContainer.html(mealInfo);
  };

  const getMealsByName = async (meal) => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
    );
    const apiResponse = await mealAPI.json();
    meals = apiResponse.meals;
    displayMeals();
    $(".loadingScreen").fadeOut(300);
  };

  const getMealsByFirstLetter = async (letter) => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    const apiResponse = await mealAPI.json();
    meals = apiResponse.meals;
    displayMeals();
    $(".loadingScreen").fadeOut(300);
  };

  navLinks.eq(0).on("click", () => {
    dataContainer.html("");
    contactContainer.html("");
    closeSideBar();
    searchMealInputs();
    sideBar.css("z-index", 99999);
  });

  const searchMealInputs = () => {
    const searchInputs = `
      <div class="col-md-6">
        <input type="text" class="inputByName form-control bg-transparent text-white" placeholder="Search By Name" />
      </div>
      <div class="col-md-6">
        <input type="text" maxlength="1" class="inputByLetter form-control bg-transparent text-white" placeholder="Search By First Letter" />
      </div>`;
    searchContainer.html(searchInputs);

    $(".inputByName").on("input", function () {
      const searchInput = $(this).val();
      getMealsByName(searchInput);
    });

    $(".inputByLetter").on("input", function () {
      const searchInputLetter = $(this).val();
      getMealsByFirstLetter(searchInputLetter);
    });
  };

  navLinks.eq(1).on("click", () => {
    dataContainer.html("");
    searchContainer.html("");
    contactContainer.html("");
    closeSideBar();
    getCategories();
  });

  let categories = [];
  const getCategories = async () => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    const apiResponse = await mealAPI.json();
    categories = apiResponse.categories;
    displayCategories();
    $(".loadingScreen").fadeOut(300);
  };

  const displayCategories = () => {
    let categoryData = "";
    categories.forEach((category) => {
      const { strCategoryThumb: imgSrc, strCategory: categoryName,strCategoryDescription: categoryDes} = category;
      categoryData += `
        <div class="col-md-3">
          <div class="item">
            <img src="${imgSrc}" class="w-100" loading="lazy" alt="${categoryName}">
            <div class="layerCat">
            <h2>${categoryName}</h2>
            <p>${categoryDes.split(" ").splice(0,18).join(" ")}</p>
            </div>
          </div>
        </div>`;
    });
    dataContainer.html(categoryData);

    $(".item").on("click", function () {
      const category = $(this).find("h2").html();
      displayMealsByCategory(category);
    });
  };

  let filteredMeals = [];

  const displayMealsByCategory = async (category) => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const apiResponse = await mealAPI.json();
    filteredMeals = apiResponse.meals;
    displayFilteredMeals();
    $(".loadingScreen").fadeOut(300);
  };

  const displayFilteredMeals = () => {
    let mealsData = "";
    filteredMeals.forEach((meal) => {
      const { strMealThumb: imgSrc, strMeal: mealName, idMeal: mealId } = meal;
      mealsData += `
        <div class="col-md-3">
          <div class="item">
            <img src="${imgSrc}" class="w-100" loading="lazy" alt="${mealName}">
            <div class="layerMeal"><h2 data-id="${mealId}">${mealName}</h2></div>
          </div>
        </div>`;
    });
    dataContainer.html(mealsData);

    $(".item").on("click", function () {
      const mealId = $(this).find("h2").attr("data-id");
      getMealById(mealId);
    });
  };

  const getMealById = async (mealId) => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const apiResponse = await mealAPI.json();
    const meal = apiResponse.meals[0];
    displayInstructions(meal);
    $(".loadingScreen").fadeOut(300);
  };

  navLinks.eq(2).on("click", () => {
    dataContainer.html("");
    searchContainer.html("");
    contactContainer.html("");
    closeSideBar();
    getArea();
  });

  let areas = [];
  const getArea = async () => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    const apiResponse = await mealAPI.json();
    areas = apiResponse.meals;
    displayArea();
    $(".loadingScreen").fadeOut(300);
  };

  const displayArea = () => {
    let areaData = "";
    areas.forEach((area) => {
      areaData += `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="item text-white">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h2>${area.strArea}</h2>
          </div>
        </div>`;
    });
    dataContainer.html(areaData);

    $(".item").on("click", function () {
      const area = $(this).find("h2").html();
      displayMealsByArea(area);
    });
  };

  let areaFilteredMeals = [];
  const displayMealsByArea = async (area) => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    const apiResponse = await mealAPI.json();
    areaFilteredMeals = apiResponse.meals;
    displayFilteredAreaMeals();
    $(".loadingScreen").fadeOut(300);
  };

  const displayFilteredAreaMeals = () => {
    let mealsData = "";
    areaFilteredMeals.forEach((meal) => {
      const { strMealThumb: imgSrc, strMeal: mealName, idMeal: mealId } = meal;
      mealsData += `
        <div class="col-md-3">
          <div class="item">
            <img src="${imgSrc}" class="w-100" loading="lazy" alt="${mealName}">
            <div class="layerMeal"><h2 data-id="${mealId}">${mealName}</h2></div>
          </div>
        </div>`;
    });
    dataContainer.html(mealsData);

    $(".item").on("click", function () {
      const mealId = $(this).find("h2").attr("data-id");
      getMealById(mealId);
    });
  };

  navLinks.eq(3).on("click", () => {
    dataContainer.html("");
    searchContainer.html("");
    contactContainer.html("");
    closeSideBar();
    getIngredients();
  });

  let ingredients = [];
  const getIngredients = async () => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    const apiResponse = await mealAPI.json();
    ingredients = apiResponse.meals;
    displayIngredients();
    $(".loadingScreen").fadeOut(300);
  };

  const displayIngredients = () => {
    let ingredientsData = "";
  
    
    const limitedIngredients = ingredients.slice(0, 20);
  
    limitedIngredients.forEach((ingredient) => {
      const description = ingredient.strDescription 
        ? ingredient.strDescription.split(" ").splice(0, 20).join(" ")
        : null;
  
     
      if (description) {
        ingredientsData += `
          <div class="col-md-3">
            <div class="item text-white text-center">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h2>${ingredient.strIngredient}</h2>
              <p class = >${description}</p>
            </div>
          </div>`;
      }
    });
  
    dataContainer.html(ingredientsData);
  
    $(".item").on("click", function () {
      const ingredient = $(this).find("h2").html();
      displayMealsByIngredient(ingredient);
    });
  };
  
  let ingredientFilteredMeals = [];
  const displayMealsByIngredient = async (ingredient) => {
    $(".loadingScreen").fadeIn(300);
    const mealAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const apiResponse = await mealAPI.json();
    ingredientFilteredMeals = apiResponse.meals;
    displayFilteredIngredientMeals();
    $(".loadingScreen").fadeOut(300);
  };

  const displayFilteredIngredientMeals = () => {
    let mealsData = "";
    ingredientFilteredMeals.forEach((meal) => {
      const { strMealThumb: imgSrc, strMeal: mealName, idMeal: mealId } = meal;
      mealsData += `
        <div class="col-md-3">
          <div class="item">
            <img src="${imgSrc}" class="w-100" loading="lazy" alt="${mealName}">
            <div class="layerMeal"><h2 data-id="${mealId}">${mealName}</h2></div>
          </div>
        </div>`;
    });
    dataContainer.html(mealsData);

    $(".item").on("click", function () {
      const mealId = $(this).find("h2").attr("data-id");
      getMealById(mealId);
    });
  };

  navLinks.eq(4).on("click", () => {
    dataContainer.html("");
    searchContainer.html("");
    contactContainer.html("");
    closeSideBar();
    contactUs();
  });

  const contactUs = () => {
    contactContainer.html(`
    <section class="min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
        <div id="contactInputs" class="row g-4">
          <div class="col-md-6">
            <div class="input-container">
              <input class="w-100 rounded form-control" placeholder="Enter Your Name" id="uName" type="text" />
              <span class="input-highlight"></span>
            </div>
            <div id="nameWarning" class="alert alert-danger w-100 mt-2">
              Special characters and numbers not allowed
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-container">
              <input class="w-100 rounded form-control" placeholder="Enter Your Email" id="email" type="email" />
              <span class="input-highlight"></span>
            </div>
            <div id="emailWarning" class="alert alert-danger w-100 mt-2">
              Email not valid *exemple@yyy.zzz
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-container">
              <input class="w-100 rounded form-control" placeholder="Enter Your Phone" id="phone" type="tel" />
              <span class="input-highlight"></span>
            </div>
            <div id="phoneWarning" class="alert alert-danger w-100 mt-2">
              Enter valid Phone Number
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-container">
              <input class="w-100 rounded form-control" placeholder="Enter Your Age" id="age" type="number" />
              <span class="input-highlight"></span>
            </div>
            <div id="ageWarning" class="alert alert-danger w-100 mt-2">
              Enter valid age
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-container">
              <input class="w-100 rounded form-control" placeholder="Enter Your Password" id="password" type="password" />
              <span class="input-highlight"></span>
            </div>
            <div id="passwordWarning" class="alert alert-danger w-100 mt-2">
              Enter valid password *Minimum eight characters, at least one letter and one number:*
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-container">
              <input class="w-100 rounded form-control" placeholder="Repeat Your Password" id="rePassword" type="password" />
              <span class="input-highlight"></span>
            </div>
            <div id="rePasswordWarning" class="alert alert-danger w-100 mt-2">
              Enter valid repassword
            </div>
          </div>
        </div>
        <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3 disabled">
          Submit
        </button>
      </div>
    </section>
    `);

    
    let submitBtn = document.getElementById("submitBtn");

    $("#nameWarning, #emailWarning, #phoneWarning, #ageWarning, #passwordWarning, #rePasswordWarning").fadeOut(0);

    $("#uName").keyup(() => {
      if (nameValidation()) {
        $("#nameWarning").fadeOut(300);
      } else {
        $("#nameWarning").fadeIn(300);
      }
      inputsValidation();
    });

    $("#email").keyup(() => {
      if (emailValidation()) {
        $("#emailWarning").fadeOut(300);
      } else {
        $("#emailWarning").fadeIn(300);
      }
      inputsValidation();
    });

    $("#phone").keyup(() => {
      if (phoneValidation()) {
        $("#phoneWarning").fadeOut(300);
      } else {
        $("#phoneWarning").fadeIn(300);
      }
      inputsValidation();
    });

    $("#age").keyup(() => {
      if (ageValidation()) {
        $("#ageWarning").fadeOut(300);
      } else {
        $("#ageWarning").fadeIn(300);
      }
      inputsValidation();
    });

    $("#password").keyup(() => {
      if (passwordValidation()) {
        $("#passwordWarning").fadeOut(300);
      } else {
        $("#passwordWarning").fadeIn(300);
      }
      inputsValidation();
    });

    $("#rePassword").keyup(() => {
      if (repasswordValidation()) {
        $("#rePasswordWarning").fadeOut(300);
      } else {
        $("#rePasswordWarning").fadeIn(300);
      }
      inputsValidation();
    });

    $("#closeContact").click(() => {
      $("#contact").fadeOut(300);
      $("#data").css("opacity", 1);
    });

    $("#contactUs").click(() => {
      closeSideNav();
      $("#data").css("opacity", 0.3);
      $("#contact").fadeIn(300);
    });

    function inputsValidation() {
      if (
        nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()
      ) {
        submitBtn.classList.remove("disabled");
        $("#submitBtn").css("cursor", "pointer");
        
      } else {
        submitBtn.classList.add("disabled");
        $("#submitBtn").css("cursor", "not-allowed");
      }
    }

    function nameValidation() {
      return /^[a-zA-Z ]+$/.test($("#uName").val());
    }

    function emailValidation() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        document.getElementById("email").value
      );
    }

    function phoneValidation() {
      return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        document.getElementById("phone").value
      );
    }

    function ageValidation() {
      return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
        document.getElementById("age").value
      );
    }

    function passwordValidation() {
      return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
        document.getElementById("password").value
      );
    }

    function repasswordValidation() {
      return (
        document.getElementById("rePassword").value ===
        document.getElementById("password").value
      );
    }
   
};





      

      

























}
  
  
  
  

































































































)
